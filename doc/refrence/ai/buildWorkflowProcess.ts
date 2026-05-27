export const WORKFLOW_PROCESS_STATUS = {
  RUNNING: 'running', // 运行中
  SUCCEEDED: 'succeeded', // 成功
  ERRORED: 'errored', // 异常
  STOPPED: 'stopped' // 停止
} as const;

export type WorkflowProcessStatus =
  (typeof WORKFLOW_PROCESS_STATUS)[keyof typeof WORKFLOW_PROCESS_STATUS];

export type WorkflowProcessStep = {
  id?: string;
  node_id?: string;
  title?: string;
  status?: WorkflowProcessStatus;
  node_type?: string;
  elapsed_time?: number | string | null;
  parallel_id?: string;
};

export type WorkflowProcess = WorkflowProcessStep[];

export const WORKFLOW_CALLBACK_TYPES = {
  WORKFLOW_STARTED: 'workflowStarted',
  WORKFLOW_FINISHED: 'workflowFinished',
  NODE_STARTED: 'nodeStarted',
  NODE_FINISHED: 'nodeFinished',
  ITERATION_STARTED: 'iterationStarted',
  ITERATION_FINISHED: 'iterationFinished',
  LOOP_STARTED: 'loopStarted',
  LOOP_FINISHED: 'loopFinished'
} as const;

const TRACE_FLAG = '时间暴露';

type WorkflowProcessPayload = Pick<
  any,
  'workflowProcess' | 'workflowProcessOpen' | 'hasHiddenOnFirstResponse'
>;

const TRACE_EVENT_SET = new Set<string>([
  WORKFLOW_CALLBACK_TYPES.NODE_STARTED,
  WORKFLOW_CALLBACK_TYPES.NODE_FINISHED,
  WORKFLOW_CALLBACK_TYPES.ITERATION_STARTED,
  WORKFLOW_CALLBACK_TYPES.ITERATION_FINISHED,
  WORKFLOW_CALLBACK_TYPES.LOOP_STARTED,
  WORKFLOW_CALLBACK_TYPES.LOOP_FINISHED
]);

const splitStepTitle = (title = '') =>
  title
    .split('-')
    .map(item => item.trim())
    .filter(Boolean);

const shouldTraceNode = (node: any) =>
  splitStepTitle(node?.title).includes(TRACE_FLAG);

const formatStepTitle = (title = '', fallback = '') => {
  const nextTitle = splitStepTitle(title).find(item => item !== TRACE_FLAG);
  return nextTitle || fallback;
};

const getParallelId = (node: any) => {
  return node?.execution_metadata?.parallel_id || node?.parallel_id || '';
};

const resolveTracingNode = (data: any) => {
  if (!data) return undefined;
  return data.node ?? data;
};

const normalizeTracingNode = (
  node: any,
  status?: string
): WorkflowProcessStep => {
  const nextStatus = status ?? node?.status;

  return {
    id: node?.id,
    node_id: node?.node_id,
    title: formatStepTitle(node?.title, node?.title || ''),
    status: nextStatus as WorkflowProcessStatus | undefined,
    node_type: node?.node_type,
    elapsed_time: node?.elapsed_time,
    parallel_id: getParallelId(node)
  };
};

const cloneWorkflowProcess = (
  workflowProcess?: WorkflowProcess
): WorkflowProcess => {
  return Array.isArray(workflowProcess)
    ? workflowProcess.map(item => normalizeTracingNode(item, item.status))
    : [];
};

const ensureWorkflowProcess = (
  workflowProcess: WorkflowProcess | undefined,
  nextPayload: WorkflowProcessPayload
) => {
  if (!nextPayload.workflowProcess) {
    nextPayload.workflowProcess = cloneWorkflowProcess(workflowProcess);
  }

  if (!Array.isArray(nextPayload.workflowProcess)) {
    nextPayload.workflowProcess = [];
  }

  return nextPayload.workflowProcess;
};

const findNodeTracingIndex = (
  tracing: WorkflowProcessStep[],
  node: WorkflowProcessStep
) => {
  return tracing.findIndex(item => {
    return (
      item.node_id === node.node_id && item.parallel_id === node.parallel_id
    );
  });
};

const findFinishedNodeIndex = (
  tracing: WorkflowProcessStep[],
  node: WorkflowProcessStep
) => {
  return tracing.findIndex(item => {
    if (!item.parallel_id && !node.parallel_id) {
      return item.id === node.id;
    }

    return item.id === node.id && item.parallel_id === node.parallel_id;
  });
};

const findTracingIndex = (
  tracing: WorkflowProcessStep[],
  node: WorkflowProcessStep
) => {
  return tracing.findIndex(item => {
    if (!item.parallel_id && !node.parallel_id) {
      return item.node_id === node.node_id;
    }

    return (
      item.node_id === node.node_id && item.parallel_id === node.parallel_id
    );
  });
};

const pushTracingNode = (
  workflowProcess: WorkflowProcess | undefined,
  node: WorkflowProcessStep,
  nextPayload: WorkflowProcessPayload
) => {
  const nextWorkflowProcess = ensureWorkflowProcess(
    workflowProcess,
    nextPayload
  );

  nextWorkflowProcess.push({
    ...node,
    status: WORKFLOW_PROCESS_STATUS.RUNNING
  });
};

const updateTracingNode = (
  workflowProcess: WorkflowProcess | undefined,
  node: WorkflowProcessStep,
  nextPayload: WorkflowProcessPayload,
  status: WorkflowProcessStatus = WORKFLOW_PROCESS_STATUS.SUCCEEDED
) => {
  const nextWorkflowProcess = ensureWorkflowProcess(
    workflowProcess,
    nextPayload
  );
  const currentIndex = findTracingIndex(nextWorkflowProcess, node);
  const nextNode = normalizeTracingNode(node, status);

  if (currentIndex === -1) {
    nextWorkflowProcess.push(nextNode);
    return;
  }

  nextWorkflowProcess[currentIndex] = nextNode;
};

const finishRunningTracingNodes = (
  workflowProcess: WorkflowProcess | undefined,
  status: WorkflowProcessStatus,
  nextPayload: WorkflowProcessPayload
) => {
  const nextWorkflowProcess = ensureWorkflowProcess(
    workflowProcess,
    nextPayload
  );

  nextPayload.workflowProcess = nextWorkflowProcess.map((item: any) => {
    if (item.status !== WORKFLOW_PROCESS_STATUS.RUNNING) {
      return item;
    }

    return {
      ...item,
      status
    };
  });
};

const workflowProcessHandlers: Record<
  string,
  (
    workflowProcess: WorkflowProcess | undefined,
    data: any,
    nextPayload: WorkflowProcessPayload
  ) => void
> = {
  [WORKFLOW_CALLBACK_TYPES.WORKFLOW_STARTED]: (_, __, nextPayload) => {
    nextPayload.workflowProcess = [];
    nextPayload.workflowProcessOpen = true;
    nextPayload.hasHiddenOnFirstResponse = false;
  },

  [WORKFLOW_CALLBACK_TYPES.WORKFLOW_FINISHED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const workflowStatus = (data?.status ||
      data?.node?.status ||
      WORKFLOW_PROCESS_STATUS.SUCCEEDED) as WorkflowProcessStatus;
    finishRunningTracingNodes(workflowProcess, workflowStatus, nextPayload);
  },

  [WORKFLOW_CALLBACK_TYPES.NODE_STARTED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode || rawNode.iteration_id || rawNode.loop_id) return;

    const node = normalizeTracingNode(rawNode, WORKFLOW_PROCESS_STATUS.RUNNING);
    const nextWorkflowProcess = ensureWorkflowProcess(
      workflowProcess,
      nextPayload
    );
    const currentIndex = findNodeTracingIndex(nextWorkflowProcess, node);

    if (currentIndex > -1) {
      nextWorkflowProcess[currentIndex] = node;
      return;
    }

    pushTracingNode(workflowProcess, node, nextPayload);
  },

  [WORKFLOW_CALLBACK_TYPES.NODE_FINISHED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode || rawNode.iteration_id || rawNode.loop_id) return;

    const node = normalizeTracingNode(rawNode);
    const nextWorkflowProcess = ensureWorkflowProcess(
      workflowProcess,
      nextPayload
    );
    const currentIndex = findFinishedNodeIndex(nextWorkflowProcess, node);

    if (currentIndex === -1) {
      updateTracingNode(
        workflowProcess,
        node,
        nextPayload,
        node.status || WORKFLOW_PROCESS_STATUS.SUCCEEDED
      );
      return;
    }

    nextWorkflowProcess[currentIndex] = normalizeTracingNode(
      rawNode,
      rawNode.status || nextWorkflowProcess[currentIndex].status
    );
  },

  [WORKFLOW_CALLBACK_TYPES.ITERATION_STARTED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode) return;

    pushTracingNode(
      workflowProcess,
      normalizeTracingNode(rawNode, WORKFLOW_PROCESS_STATUS.RUNNING),
      nextPayload
    );
  },

  [WORKFLOW_CALLBACK_TYPES.ITERATION_FINISHED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode) return;

    updateTracingNode(
      workflowProcess,
      normalizeTracingNode(rawNode),
      nextPayload,
      (rawNode.status ||
        WORKFLOW_PROCESS_STATUS.SUCCEEDED) as WorkflowProcessStatus
    );
  },

  [WORKFLOW_CALLBACK_TYPES.LOOP_STARTED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode) return;

    pushTracingNode(
      workflowProcess,
      normalizeTracingNode(rawNode, WORKFLOW_PROCESS_STATUS.RUNNING),
      nextPayload
    );
  },

  [WORKFLOW_CALLBACK_TYPES.LOOP_FINISHED]: (
    workflowProcess,
    data,
    nextPayload
  ) => {
    const rawNode = resolveTracingNode(data);
    if (!rawNode) return;

    updateTracingNode(
      workflowProcess,
      normalizeTracingNode(rawNode),
      nextPayload,
      (rawNode.status ||
        WORKFLOW_PROCESS_STATUS.SUCCEEDED) as WorkflowProcessStatus
    );
  }
};

export const buildWorkflowProcess = (
  event: string,
  data: any,
  message?: any
) => {
  if (TRACE_EVENT_SET.has(event)) {
    const rawNode = resolveTracingNode(data.node);

    if (!rawNode || !shouldTraceNode(rawNode)) {
      return null;
    }
  }

  if (
    (message?.content || message?.thoughts) &&
    message.workflowProcess &&
    !message?.hasHiddenOnFirstResponse
  ) {
    message.workflowProcessOpen = false;
    message.hasHiddenOnFirstResponse = true;
  }

  const handler = workflowProcessHandlers[event];

  if (!handler) return null;

  const nextPayload: WorkflowProcessPayload = {
    workflowProcess: undefined,
    workflowProcessOpen: message.workflowProcessOpen,
    hasHiddenOnFirstResponse: message.hasHiddenOnFirstResponse
  };

  handler(message.workflowProcess, data.node, nextPayload);

  message.workflowProcess = nextPayload.workflowProcess;
  message.workflowProcessOpen = nextPayload.workflowProcessOpen;
  message.hasHiddenOnFirstResponse = nextPayload.hasHiddenOnFirstResponse;
};

export default buildWorkflowProcess;

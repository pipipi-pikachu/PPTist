<template>
  <MoveablePanel 
    class="notes-panel" 
    :width="300" 
    :height="560" 
    :title="`Slide ${slideIndex + 1} Comments`" 
    :left="-270" 
    :top="90"
    :minWidth="300"
    :minHeight="400"
    :maxWidth="480"
    :maxHeight="780"
    resizeable
    @close="close()"
  >
    <div class="container">
      <div class="notes" ref="notesRef">
        <div class="note" :class="{ 'active': activeNoteId === note.id }" v-for="note in notes" :key="note.id" @click="handleClickNote(note)">
          <div class="header note-header">
            <div class="user">
              <div class="avatar"><IconUser /></div>
              <div class="user-info">
                <div class="username">{{ note.user }}</div>
                <div class="time">{{ new Date(note.time).toLocaleString() }}</div>
              </div>
            </div>
            <div class="btns">
              <div class="btn reply" @click="replyNoteId = note.id">Reply</div>
              <div class="btn delete" @click.stop="deleteNote(note.id)">Delete</div>
            </div>
          </div>
          <div class="content">{{ note.content }}</div>
          <div class="replies" v-if="note.replies?.length">
            <div class="reply-item" v-for="reply in note.replies" :key="reply.id">
              <div class="header reply-header">
                <div class="user">
                  <div class="avatar"><IconUser /></div>
                  <div class="user-info">
                    <div class="username">{{ reply.user }}</div>
                    <div class="time">{{ new Date(reply.time).toLocaleString() }}</div>
                  </div>
                </div>
                <div class="btns">
                  <div class="btn delete" @click.stop="deleteReply(note.id, reply.id)">Delete</div>
                </div>
              </div>
              <div class="content">{{ reply.content }}</div>
            </div>
          </div>
          <div class="note-reply" v-if="replyNoteId === note.id">
            <TextArea :padding="6" v-model:value="replyContent" placeholder="Enter your reply" :rows="1" @enter.prevent="createNoteReply()" />
            <div class="reply-btns">
              <Button class="btn" size="small" @click="replyNoteId = ''">Cancel</Button>
              <Button class="btn" size="small" type="primary" @click="createNoteReply()">Create</Button>
            </div>
          </div>
        </div>
        <div class="empty" v-if="!notes.length">There are no comments on this page</div>
      </div>
      <div class="send">
        <TextArea 
          ref="textAreaRef"
          v-model:value="content"
          :padding="6"
          :placeholder="`Enter a comment (for${handleElementId ? 'Selected elements' : 'Current Page Slideshow' }）`"
          :rows="2"
          @focus="replyNoteId = ''; activeNoteId = ''"
          @enter.prevent="createNote()"
        />
        <div class="footer">
          <IconDelete class="btn icon" v-tooltip="'Clear comments'" style="flex: 1" @click="clear()" />
          <Button type="primary" class="btn" style="flex: 12" @click="createNote()">Add Note</Button>
        </div>
      </div>
    </div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { Note } from '@/types/slides'

import MoveablePanel from '@/components/MoveablePanel.vue'
import TextArea from '@/components/TextArea.vue'
import Button from '@/components/Button.vue'

const slidesStore = useSlidesStore()
const mainStore = useMainStore()
const { slideIndex, currentSlide } = storeToRefs(slidesStore)
const { handleElementId } = storeToRefs(mainStore)

const content = ref('')
const replyContent = ref('')
const notes = computed(() => currentSlide.value?.notes || [])
const activeNoteId = ref('')
const replyNoteId = ref('')
const textAreaRef = ref<InstanceType<typeof TextArea>>()
const notesRef = ref<HTMLElement>()

watch(slideIndex, () => {
  activeNoteId.value = ''
  replyNoteId.value = ''
})

const scrollToBottom = () => {
  if (notesRef.value) {
    notesRef.value.scrollTop = notesRef.value.scrollHeight
  }
}

const createNote = () => {
  if (!content.value) {
    if (textAreaRef.value) textAreaRef.value.focus()
    return
  }

  const newNote: Note = {
    id: nanoid(),
    content: content.value,
    time: new Date().getTime(),
    user: 'Test User',
  }
  if (handleElementId.value) newNote.elId = handleElementId.value

  const newNotes = [
    ...notes.value,
    newNote,
  ]
  slidesStore.updateSlide({ notes: newNotes })

  content.value = ''

  nextTick(scrollToBottom)
}

const deleteNote = (id: string) => {
  const newNotes = notes.value.filter(note => note.id !== id)
  slidesStore.updateSlide({ notes: newNotes })
}

const createNoteReply = () => {
  if (!replyContent.value) return
  
  const currentNote = notes.value.find(note => note.id === replyNoteId.value)
  if (!currentNote) return

  const newReplies = [
    ...currentNote.replies || [],
    {
      id: nanoid(),
      content: replyContent.value,
      time: new Date().getTime(),
      user: 'Test User',
    },
  ]
  const newNote: Note = {
    ...currentNote,
    replies: newReplies,
  }
  const newNotes = notes.value.map(note => note.id === replyNoteId.value ? newNote : note)
  slidesStore.updateSlide({ notes: newNotes })

  replyContent.value = ''
  replyNoteId.value = ''

  nextTick(scrollToBottom)
}

const deleteReply = (noteId: string, replyId: string) => {
  const currentNote = notes.value.find(note => note.id === noteId)
  if (!currentNote || !currentNote.replies) return
  
  const newReplies = currentNote.replies.filter(reply => reply.id !== replyId)
  const newNote: Note = {
    ...currentNote,
    replies: newReplies,
  }
  const newNotes = notes.value.map(note => note.id === noteId ? newNote : note)
  slidesStore.updateSlide({ notes: newNotes })
}

const handleClickNote = (note: Note) => {
  activeNoteId.value = note.id

  if (note.elId) {
    const elIds = currentSlide.value.elements.map(item => item.id)
    if (elIds.includes(note.elId)) {
      mainStore.setActiveElementIdList([note.elId])
    }
    else mainStore.setActiveElementIdList([])
  }
  else mainStore.setActiveElementIdList([])
}

const clear = () => {
  slidesStore.updateSlide({ notes: [] })
}

const close = () => {
  mainStore.setNotesPanelState(false)
}
</script>

<style lang="scss" scoped>
.notes-panel {
  height: 100%;
  font-size: 12px;
  user-select: none;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.notes {
  flex: 1;
  overflow: auto;
  margin: 0 -10px;
  padding: 2px 12px;
}
.empty {
  width: 100%;
  height: 100%;
  color: #999;
  font-style: italic;
  display: flex;
  justify-content: center;
  align-items: center;
}
.note {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;

  & + .note {
    margin-top: 10px;
  }
  &.active {
    background-color: #f7f7f7;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;

    &:hover {
      .btns {
        opacity: 1;
      }
    }
  }
  .user {
    display: flex;
    align-items: center;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #42ba97;
      color: #fff;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }

    .username {
      font-size: 14px;
    }
    .time {
      font-size: 12px;
      color: #aaa;
    }
  }
  .btns {
    display: flex;
    align-items: center;
    opacity: 0;

    .btn {
      margin-left: 5px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
        color: $themeColor;
      }
    }
  }
  .replies {
    margin-left: 20px;
    margin-top: 15px;

    .reply-item {
      margin-top: 10px;

      .content {
        margin-top: 5px;
      }
    }
  }
}
.note-reply {
  margin-top: 15px;
}
.reply-btns {
  margin-top: 5px;
  text-align: right;

  .btn {
    margin-left: 8px;
  }
}
.send {
  height: 120px;
  flex-shrink: 0;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  
  .footer {
    margin-top: 10px;
    display: flex;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      
      &.icon {
        font-size: 18px;
        color: #666;
        cursor: pointer;
      }
    }

    .btn + .btn {
      margin-left: 8px;
    }
  }
}
</style>
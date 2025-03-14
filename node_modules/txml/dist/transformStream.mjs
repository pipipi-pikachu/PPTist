import { parse } from './txml.mjs';
import through2 from 'through2';

function transformStream(offset, parseOptions) {
    if(!parseOptions) parseOptions = {};
    if (typeof offset === 'string') {
        offset = offset.length;
    }

    var position = offset || 0;
    var data = '';
    const stream = through2({ readableObjectMode: true }, function (chunk, enc, callback) {
        data += chunk;
        var lastPos = 0;
        do {
            position = data.indexOf('<', position) + 1;
            
            if (!position) {
                position = lastPos;
                return callback();            }
            if (data[position] === '/') {
                position = position + 1;
                lastPos = position;
                continue;
            }
            if (data[position] === '!' && data[position + 1] === '-' && data[position + 2] === '-') {
                const commentEnd = data.indexOf('-->', position + 3);
                if (commentEnd === -1) {
                    data = data.slice(lastPos);
                    position = 0;
                    return callback();                }

                if(parseOptions.keepComments){
                    this.push(data.substring(position-1, commentEnd+3));
                }

                position = commentEnd + 1;
                lastPos = commentEnd;
                continue;
            }

            var res = parse(data, {...parseOptions, pos: position - 1, parseNode: true, setPos: true });
            position = res.pos;
            //console.log(res, res.pos)
            if (position > (data.length - 1) || position < lastPos) {
                data = data.slice(lastPos);
                position = 0;
                return callback();            } else {
                this.push(res);
                lastPos = position;
            }
        } while (1);
    });

    return stream;
}

export { transformStream };

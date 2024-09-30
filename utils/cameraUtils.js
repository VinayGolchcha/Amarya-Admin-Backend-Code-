import ffmpeg from 'fluent-ffmpeg';

export const checkRtspStatus = async (rtspUrl) => {
    return new Promise((resolve, reject) => {
        const command = ffmpeg(rtspUrl)
            .on('start', (commandLine) => {
                console.log(`FFmpeg process started: ${commandLine}`);
            })
            .on('stderr', (stderrLine) => {
                console.log('FFmpeg log:', stderrLine);
            })
            .on('error', (err) => {
                console.log(`RTSP stream is down or unreachable: ${err.message}`);
                reject(new Error('Stream is down or unreachable.'));
            })
            .on('end', () => {
                console.log('RTSP stream is accessible and running.');
                resolve('Stream is accessible and running.');
            });

        command
            .inputOptions('-analyzeduration', '100000')
            .inputOptions('-probesize', '50000')
            .outputOptions('-vframes 1')
            .outputOptions('-f null')
            .output('NUL')
            .run();

        const timeout = setTimeout(() => {
            console.log('FFmpeg process timed out.');
            command.kill('SIGKILL');
            reject(new Error('FFmpeg process timed out.'));
        }, 10000);

        command.on('end', () => clearTimeout(timeout));
    });
};

var gulp = require('gulp');
var argv = require('yargs').argv;
var _slack = require('node-slack');
var slack = new _slack('https://hooks.slack.com/services/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');
var through = require('through2');
var client = require('firebase-tools');
var runSequence = require('run-sequence');

gulp.task('default', ['compile']);

gulp.task('compile', function (cb) {
    var ret = runSequence(
        'browserify-dev',
        'cacheBust',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });

    gulp.on('stop', function () {
        process.nextTick(function () {
            process.exit(0);
        });
    });
    return ret
})

gulp.task('compile-all', function (cb) {
    var ret = runSequence(
        'vendor',
        'browserify',
        'css',
        'cacheBust',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });

    gulp.on('stop', function () {
        process.nextTick(function () {
            process.exit(0);
        });
    });
    return ret
})

gulp.task('compile-test', function (cb) {
    return runSequence(
        'compile-all',
        'test',
        'watch',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });
})

// var message = {
//     token: '',
//     team: '',
//     channel: '#tech',
//     icon_emoji: ':bowtie:',
//     username: 'ibid'
// };

// var sendToSlack = function(i) {
//     slack.send(i);
//     return through.obj(i);
// };
//
// var pushAndNotify = function(p, error, cb) {
//     if (error) {
//         console.log(error.message);
//         if(cb) cb(error);
//     } else {
//         var pkg = global.HomunculusPackage
//         message.text = 'Just deployed Homunculus v' + pkg.version + ' to https://www.Homunculus.co. ' + p;
//
//         client.deploy({
//             message: p
//         }).then(function () {
//             sendToSlack(message)
//             setTimeout(function () {
//                 console.log('RELEASE FINISHED SUCCESSFULLY');
//                 cb();
//                 process.nextTick(function () {
//                     process.exit(0);
//                 });
//             }, 5000)
//         })
//     }
// }
//
// gulp.task('pushAndNotify', function(cb) {
//     var p = argv.message;
//     pushAndNotify(p, null, cb)
// })

gulp.task('release', function (cb) {
    var p = argv.message;
    runSequence(
        'bump',
        'compile-all',
        'bumpDist',
        'commit',
        'tag',
        function (error) {
            pushAndNotify(p, error, cb)
        });
})


#!/usr/bin/env node
'use strict';

const program    = require('commander');
const chalk      = require('chalk');
const clear      = require('clear');
const figlet     = require('figlet');
const fs         = require('fs');
const Handlebars = require('handlebars');
const CliFrames = require("cli-frames");

var data = JSON.parse(fs.readFileSync('me.json', 'utf8'));

program
  .version('1.0.0')
  .description('Prints out my professional contact card in different formats.')
  .option('--no-color',     'Suppress color output')
  .option('--debug',        'Output debugging information')
  .option('--json',         'Output json')
  .option('--html',         'Output html')
  .option('--text',         'Output text (default)')
  .option('--no-animation', 'Suppress the animation')
  .on('json', () => { program.outputType = 'json'} )
  .on('html', () => { program.outputType = 'html'} )
  .on('text', () => { program.outputType = 'text'} )
  .parse(process.argv);

if (program.animation) {
    animateName(data, program, function() {
        printBio(data, program);
        process.exit();
    });
} else {
    printBio(data, program);
    process.exit();
}

/**
 * Prints out the bio information
 *
 * @method printBio
 * @param  {Object} data Contact data
 * @param  {Object} opts cli options
 */
function printBio(data, opts) {
    var document;
    switch(opts.outputType) {
        case "json":
            document = toJson(data, opts);
            break;
        case "html":
            document = toHtml(data, opts);
            break;
        case "text":
            document = toText(data, opts);
            break;
        default:
            if(typeof(opts.type) !== 'undefined') {
                process.stdout.write("Unrecognized type, use one of: --json, --html, --text");
                process.exit();
            } else {
                document = toText(data, opts);
            }
    }

    process.stdout.write(document);
}
/**
 * Factory method to generate a handlebars helper function
 * that chunks groups of n items separated by the join
 * characters in the output template.
 *
 * @method chunkerFactory
 * @param  {Number} chunk Number of elements to chunk.
 * @param  {String} join  Characters used to join the elements in a chunk.
 * @return {Function}     Function that will be suitable as as
 */
function chunkerFactory(chunk, join) {
    return (context, options) => {
        var ret = "";
        for(var i = 0, l = context.length; i < l; i += chunk) {
            var line = context.slice(i, i + chunk).join(join);
            ret = ret + options.fn(line);
        }

        return ret;
    }
}

/**
 * Generates the data as JSON
 *
 * @method toJson
 * @param  {Object} data Contact data
 * @param  {Object} opts cli options
 * @return {String} formatted document
 */
function toJson(data, opts) {
    return JSON.stringify(data);
}

/**
 * Generates the text version of the data
 *
 * @method toText
 * @param  {Object} data Contact data
 * @param  {Object} opts cli options
 * @return {String} formatted document
 */
function toText(data, opts) {
    Handlebars.registerHelper('each5', chunkerFactory(5, ', '));
    Handlebars.registerHelper('each10', chunkerFactory(10, ', '));

    var template = Handlebars.compile(
        fs.readFileSync('me.txt.hb', 'utf8')
    );

    var title = figlet.textSync(data.name, { horizontalLayout: 'full' });
    if (opts.color) {
        title = chalk.green(title);
    }
    var doc = template(data);
    return title + "\n" + doc + "\n";
}

/**
 * Generates the html version of the data
 *
 * @method toHtml
 * @param  {Object} data Contact data
 * @param  {Object} opts cli options
 * @return {String} formatted document
 */
function toHtml(data, opts) {
    var template = Handlebars.compile(
        fs.readFileSync('me.html.hb', 'utf8')
    );

    var doc = template(data);
    return doc + "\n";
}

/**
 * Animate the name at startup.
 *
 * @method animateName
 * @param {Object} data Contact data
 * @param {Object} opts cli options
 * @param {Function} [callback] callback function to run after the animation.
 */
function animateName(data, opts, callback) {
    var frames = [];
    for(var n = 0, l = data.name.length; n < l; n++) {
        var name = data.name.substr(0, n);
        var title = figlet.textSync(name, { horizontalLayout: 'full' });
        if (opts.color) {
            title = chalk.green(title);
        }
        frames.push(title);
    }

    var rules = {
        frames: frames,
        autostart: {
            delay: 150
        }
    };

    if (callback) {
        rules.autostart.end = callback;
    }

    new CliFrames(rules);
}


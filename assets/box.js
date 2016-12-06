"use strict"
/*
    CLI-GUI2 - Command line interface library
    Copyright (C) 2016 Andrew S

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
module.exports = class Box {
    constructor(main, x, y, width, height, text, opt, calls) {
        this.main = main;
        this.vis = main.visual
        this.width = width;
        this.height = height
        this.x = x;
        this.y = y;
        this.text = this.vis.wrap(text, this.width)

        this.options = this.genOptions(opt, calls)
        this.chosen = 0;
        this.call = calls;
        this.update()
    }
    onRemove() {

    }
    genOptions(opt, c) {
        var final = [];



        if (opt[0]) {
            if (typeof c == "object") {
                opt.forEach((o, i) => {
                    if (!o.call && c[i]) o.call = c[i]
                })
            }
            final = opt
        } else {
            for (var i in opt) {
                final.push({
                    name: i,
                    call: opt[i]
                })
            }

        }

        final.forEach((f) => {

            f.vis = this.vis.fill(f.name)
        })
        return final;
    }
    wrap(arr, maxlen) {
        var results = [];

        while (0 == 0) {
            if (arr.length < maxlen) {
                results.push(arr);
                break;
            }
            var s = arr.slice(0, maxlen);
            var index = s.lastIndexOf(" ");
            if (index != -1) {
                results.pushoncat(s.slice(0, index))
                arr = arr.slice(index + 1)
            } else {
                results.push(arr);
                break;
            }
        }


        return results;

    }
    onKey(key) {

        switch (key) {
        case "UP":
            if (this.chosen <= 0) return
            this.chosen--;
            break;
        case "DOWN":
            if (this.chosen >= this.options.length - 1) return
            this.chosen++;
            break;
        case "ENTER":
            if (typeof this.call == "function") {
                this.call(this.chosen, this.main)

                return;
            }
            if (this.options[this.chosen].call) {
                this.options[this.chosen].call(this.main)
                return;
            }
            return
            break;
        case "LEFT":
            if (this.chosen <= 0) return
            this.chosen--;
            break;
        case "RIGHT":
            if (this.chosen >= this.options.length - 1) return
            this.chosen++;
            break;
        default:
            return
            break;
        }
        this.update()
    }

    update() {
        var a = this.y
        for (var i = 0; i < this.height; i++) {


            if (this.text[i]) this.vis.setRow(a, this.vis.centerHor(this.text[i], this.width), '\x1b[30m\x1b[47m', 1, this.x);
            else
                this.vis.setRow(a, this.vis.fill(' ', this.width), '\x1b[30m\x1b[47m', 1, this.x);

            a++;
        }
        var text = [];

        for (var i = 0; i < this.options.length; i++) {
            var name = '[' + this.options[i].name + ']'
            if (i == this.chosen) {
                text.push('\x1b[40m\x1b[37m')
                name.split("").forEach((a) => {
                    text.push(a)
                })
                text.push('\x1b[30m\x1b[47m')
            } else
                text = text.concat(name.split(""))
            text.push(" ")
        }


        text = this.wrap(text, this.width)


        for (var i = 0; i < text.length; i++) {
            this.vis.setRow(a, this.vis.centerHor(text[i].join(""), this.width, text[i].length - 2), '\x1b[30m\x1b[47m', 1, this.x);
            a++
        }
        this.vis.update()
    }

}
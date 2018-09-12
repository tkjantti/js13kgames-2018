/*
 * Copyright 2018 Tero Jäntti, Sami Heikkinen
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

/* exported maps */

const maps = [
    {
        online: Number.POSITIVE_INFINITY,
        offline: 0,
        text: "COLLECT THE ARTIFACTS",
        data: [
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "          a  a      ",
            "                    ",
            "      @             ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ]
    },
    {
        online: Number.POSITIVE_INFINITY,
        offline: 0,
        text: "AVOID THE GHOSTS",
        data: [
            "                    ",
            "         @     G    ",
            "                    ",
            "                    ",
            "    ==     =====    ",
            "    =   =  =#A#=    ",
            "    =   ====###=    ",
            "    =          =    ",
            "    =          =    ",
            "    ============    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ]
    },
    {
        online: Number.POSITIVE_INFINITY,
        offline: 0,
        text: "THESE WON'T HURT YOU",
        data: [
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "       ###          ",
            "      ##A##         ",
            "      #####         ",
            "  ====#   #====     ",
            "  =####   ####=     ",
            "  =#G #   #G #=     ",
            "  =#  #   #  #=     ",
            "  =####   ####=     ",
            "  ===== @ =====     ",
            "                    ",
            "                    ",
        ]
    },
    {
        online: 4000,
        offline: 10000,
        text: "UNLESS...",
        data: [
            "                           ",
            "G    G    G    G           ",
            "                           ",
            "                           ",
            "                           ",
            "###########################",
            "                           ",
            "                           ",
            " @   a      a      a       ",
            "                           ",
            "                           ",
            "###########################",
            "                           ",
            "                           ",
            " G    G    G    G          ",
            "                           ",
        ]
    },
    {
        online: 4500,
        offline: 3000,
        text: "KEEP GOING",
        data: [
            " @                  ",
            "  ###############   ",
            " ################   ",
            "               ##   ",
            "               ## G ",
            "               ##   ",
            "               ##   ",
            "               ##   ",
            "               ##   ",
            "             G ##   ",
            "    G          ##   ",
            "   ##############   ",
            "   #A############   ",
            "   ###     G        ",
            " G                  ",
        ]
    },
    {
        online: 5000,
        offline: 1600,
        text: "STAY WITHIN THE LINES",
        data: [
            "  #  #  #  #  #  #  ",
            " @# G#  # G#  #G #  ",
            "#################A##",
            "G #  #  #  # G#  # G",
            "  #  #  #  #  #  #  ",
            "#####A##############",
            "  # G#  # G#  #  #  ",
            "  #  #  #  #  #  #  ",
            "##############A#####",
            " G#  #  #  # G#  # G",
            "  #  #  #  #  #  #  ",
            "#################A##",
            "  #  #  #  #  #  #  ",
            "  # G#  # G#  #  #  ",
            "########A###########",
        ]
    },
    {
        online: 10000,
        offline: 6000,
        text: "DON'T PANIC",
        data: [
            "==================================",
            "                        #########=",
            "   @               ===  =======##=",
            "       =====       ===            ",
            "========#A#======  ===##====  ==  ",
            "#######=A#A=####=  #      ##  ==  ",
            "#  #  #=   =#  #=  =====  ==  ==  ",
            "#G #G #=   =#G #=  =====  ==    ##",
            "#######=   =####=  =====  ==##====",
            "     #     ======  =====      ====",
            "     #     #           #  ==     =",
            "    #      #       =====  =====##=",
            "####  G    #====  #  ===  ==     =",
            "   #      #========    =##=     #=",
            "=   ######==     G     #     G###=",
            "==                     #    #####=",
            "==================================",
        ]
    },
    {
        online: 5000,
        offline: 1500,
        text: "BOO!",
        data: [
            "                    ",
            "                    ",
            "                    ",
            "    =============   ",
            "    =#        Ga=   ",
            "    =#  == ====G=   ",
            "    =#  =#A= #= =   ",
            "    =#  =#A= #= =   ",
            "    =#  == ==== =   ",
            "    =# @       a=   ",
            "    =============   ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
        ]
    },
    {
        online: Number.POSITIVE_INFINITY,
        offline: 0,
        text: "THEY'LL ALWAYS FOLLOW",
        data: [
            "               G  G  G  G G G  G G      ",
            "              G  G G G G G  G G  G  G   ",
            "         G  G  G  G    G  G    G G G  G ",
            "                G  ###########A     G  G",
            "  G    G    G  G  #############  G      ",
            "                 G## G  G  G GG   G    G",
            " G  G  G  G   G   ##  G    G    G   G   ",
            "                  ## G   G   G  G G    G",
            "  G   G ############   G   G   G   G G  ",
            "        #@#########  G   G G G   G      ",
            " G  G   ###                G     G      ",
            "            G  G   G  G  G              ",
            "    G  G         G   G                  ",
            " G        G  G  G                       ",
            "     G  G                               ",
        ]
    },
    {
        online: 15000,
        offline: 9000,
        text: "GOOD LUCK",
        data: [
            "==========  ##    ##G            ",
            "=########= #  #    ##   #####   G",
            "=#    G #=##   #A      ##   ##   ",
            "=# =#   #=#     ##     #     #   ",
            "=# =###A#=# ===  #   ###     #   ",
            "=# =======# ===  ##  #    ===   =",
            "=#      ## #==    ###  #   =#   =",
            "=#####  ##== # ===     #   =#  a=",
            "         ######        #    =   =",
            "    #####=    #####    #    =   #",
            "#####   =  == #   # = ##   ##   #",
            "#  G#===    = # @ # =##   =##   #",
            "#  =#===    = #   # ===  =##    #",
            "#  =#===      #####  =# G=#a   G#",
            "#  =#===#=           =#  =###   =",
            "#  =#===#### =====  #=#   ===   =",
            "#  =#=### # =    ############   =",
            "#  =### ###=  #  #  #       #   =",
            " =### ####=  #   #   ===    #   =",
            "##A# ####=  #   ###  =a=   ###  =",
            "#######=   ##G   #          #   =",
            " G==# ########   ###############=",
            "                           G### =",
        ]
    },
    {
        online: Number.POSITIVE_INFINITY,
        offline: 0,
        text: "WHOA",
        data: [
            "     G G G G G G    ",
            "  G               G ",
            "                    ",
            "                    ",
            "G                   ",
            "                   G",
            "                    ",
            "G        @          ",
            "                    ",
            "                   G",
            "G                   ",
            "                    ",
            "                    ",
            "  G              G  ",
            "     G G G G G G    ",
        ]
    }
];

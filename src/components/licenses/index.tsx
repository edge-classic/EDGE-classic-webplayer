import { FunctionComponent, h } from 'preact';
import style from './style.css';

const LicenseModal: FunctionComponent<{ onClose: () => void }> = ({ onClose }) => (
    <div id="myModal" class={style.modal}>
        <div class={style.modal_content}>
            <div class={style.modal_header}>
                <span class={style.close} onClick={() => onClose()}>&times;</span>
                <h2>EDGE-Classic Licenses</h2>
            </div>
            <div class={style.modal_body}>
                <div style={{ overflowY: "scroll", overflowX: "hidden", height: "512px" }}>
                    <div style={{ fontFamily: "monospace", whiteSpace: "pre", fontSize: 11 }}>{license}</div>
                </div>
            </div>
            <div class={style.modal_footer}>
            </div>
        </div>
    </div>

);

const license = `===========================================================================================
BSD 3-Clause License
===========================================================================================

"16-Bit Game Station" soundfont (select melodic instruments)
  Copyright (c) 2009 Beatnik, Inc

ANGLE (Almost Native Graphics Layer Engine) - Copyright (c) 2018 Google Inc. and ANGLE Project Authors

AlmostEquals Google Test Framework Component - Copyright (c) 2005 Google, Inc.

Blasphemer (various assets) - Copyright (c) 2021 Contributors to the Blasphemer project

Freedoom (various assets) - Copyright (c) 2001-2019 Contributors to the Freedoom project

"FDDMX" instrument bank - Copyright (c) 2023 Contributors to the Freedoom project
  Copyright (c) ConSiGno ("DMXOPL" instrument bank which formed the basis for FDDMX)

libRAD (patches.cpp/radmidi.cpp, adapted from YMFMIDI) - Copyright (c) 2021-2023 Devin Acker

Mod4Play library - Copyright (c) 2024 dashodanger
  Copyright (c) 2022 Olav Sørensen

minivorbis library - Copyright (c) 2020 Eduardo Bart
  Copyright (c) 2002-2020 Xiph.org Foundation

ZDoom FName implementation - Copyright (c) 2005-2007 Randy Heit

===========================================================================================
CC 1.0 Universal License
===========================================================================================

HandmadeMath.h - Ben Visness

"ProtoSquare!" soundfont - Yingchun Soul

===========================================================================================
CC-BY-3.0 Unported License
===========================================================================================

German Shepherd Dog Sprites - Copyright (c) 2017 Nash Muhandes

===========================================================================================
CC-BY-NC-4.0 International License
===========================================================================================

REKKR (various assets) - Copyright (c) 2021 Mockingbird Softworks

===========================================================================================
CC-BY-SA-4.0 International License
===========================================================================================

"ChipFreak" soundfont - Copyright (c) Jayvee Enaguas

===========================================================================================
GPL3 License
===========================================================================================

"Apogee" instrument bank - Melodic instruments Copyright (C) 1994-1995 Apogee Software, Ltd.
	Percussion instruments Copyright (C) 1999, 2000, 2001 Simon Peter, et al.

AJBSP - Copyright (c) 2000-2023 Andrew Apted, et al
	Copyright (c) 1994-1998 Colin Reed
	Copyright (c) 1997-1998 Lee Killough

COAL - Copyright (c) 2021-2024 The EDGE Team
	Copyright (c) 2009-2021 Andrew Apted, et al
  Copyright (c) 1996-1997 Id Software, Inc.

DDF library - Copyright (c) 1999-2024 The EDGE Team

DEH_EDGE library - Copyright (c) 2004-2024 The EDGE Team

EDGE-Classic - Copyright (c) 1999-2024 The EDGE Team

EPI library - Copyright (c) 2002-2024 The EDGE Team

Fluidlite - Copyright (c) 2016 Robin Lobel

SLADE (IMF->WAV conversion and sky drawing routines) - Copyright (c) 2008 - 2023 Simon Judd

SuperFastHash - Copyright (c) 2004-2010 Paul Hsieh

XMIDI library (MIDI conversion) - Copyright (c) 2015-2022 Vitaly Novichkov
	Copyright (c) 2015-2016 WildMIDI Developers
	Copyright (c) 2014 Bret Curtis
	Copyright (c) 2001 Ryan Nunn

===========================================================================================
HacX License
===========================================================================================

HacX 1.2/2.0 (various assets) - Copyright (c) 1997-2012 Banjo Software, et al

===========================================================================================
MIT License
===========================================================================================

3dreamEngine Lua Math Libraries - Copyright (c) 2019 Luke100000 

"16-Bit Game Station" soundfont (percussion and select melodic instruments) - Copyright (c) 2022 Yingchun Soul

base64.lua - Copyright (c) 2018 Ilya Kolbin 

BW_Midi_Sequencer library - Copyright (c) 2015-2022 Vitaly Novichkov

"C++ implementation of a fast Gaussian blur algorithm by Ivan Kutskir - Integer Version"
	Copyright (C) 2017 Basile Fraboni
	Copyright (C) 2014 Ivan Kutskir

debugger.lua -Copyright (c) 2023 Scott Lembcke and Howling Moon Software

gl4es library - Copyright (c) 2016-2018 Sebastien Chevalier
	Copyright (c) 2013-2016 Ryan Hileman

glad library - Copyright (c) 2013-2022 David Herberth

json.lua - Copyright (c) 2020 rxi

Lua - Copyright (C) 1994-2023 Lua.org, PUC-Rio.

miniz library - Copyright (c) 2013-2014 RAD Game Tools and Valve Software
	Copyright (c) 2010-2014 Rich Geldreich and Tenacious Software LLC

PL_MPEG library - Copyright(c) 2019 Dominic Szablewski

PNPOLY algorithm - Copyright (c) 1970-2003 Wm. Randolph Franklin

utf8proc library - Copyright (c) 2014-2021 Steven G. Johnson, Jiahao Chen, Tony Kelman, 
	Jonas Fonseca, et al

===========================================================================================
Public Domain
===========================================================================================

dr_wav, dr_mp3, and dr_flac libraries - David Reid

Fraction.hpp - Bisqwit

libRAD (opal.cpp/radplay.cpp) - Reality Productions

"sf_GMbank" soundfont (renamed to Default.sf2) - The Csound Developers

stb_image, stb_image_write, stb_rect_pack and stb_truetype libraries - Sean Barrett

===========================================================================================
SIL Open Font License
===========================================================================================

Fira Code (renamed to ECFONT02.ttf) - Copyright 2014-2020 The Fira Code Project Authors

Germania One (renamed to ECFONT03.ttf) - Copyright (c) 2011, John Vargas Beltrán,
	with Reserved Font Name "Germania One"

Russo One (renamed to ECFONT01.ttf) - Copyright (c) 2011-2012, Jovanny Lemonad,
	with Reserved Font Name "Russo"

===========================================================================================
WidePix License
===========================================================================================

WidePix (various assets) - Copyright (c) 2020-2021 Nash Muhandes

===========================================================================================
zlib License
===========================================================================================

LOVE2D (Windows swapbuffers code) - Copyright (c) 2006-2024 LOVE Development Team

SDL2 library - Copyright (c) 1997-2020 Sam Lantinga
`

export default LicenseModal;

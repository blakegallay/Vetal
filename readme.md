<!-- Generated by documentation.js. Update this documentation by updating the source code. -->
# Vetal - A Multi-Messenger SkyMap

Vetal is an ongoing project under the Wisconsin IceCube Particle Astrophysics Center, created by Blake Gallay, Elsa Forberger, and Haley James as part of the 2017 WIPAC Summer High School Internship.

### Table of Contents

-   [Interface](#interface)
    -   [hideshow](#hideshow)
-   [Main](#main)
    -   [initialize](#initialize)
-   [Output](#output)
    -   [skymap](#skymap)
        -   [skymap](#skymap-1)
-   [Processing](#processing)
    -   [customReader](#customreader)
        -   [customReader](#customreader-1)
    -   [text](#text)
-   [Utility](#utility)
    -   [isSelected](#isselected)
    -   [toDegrees](#todegrees)
    -   [toRadians](#toradians)
-   [Analysis](#analysis)

## Interface

### hideshow

Toggles the visibility of various HTML elements

<ul style="list-style: none;">
 <li> time filtering ("times", "set_margin")
 <li> flux filtering ("flux_form")
 <li> spectral index filtering ("spec_form")
</ul>

## Main

### initialize

Begins parsing of data and drawing of skymap <p>
Called on load, as well as on significant changes (making selections, performing analysis, configuring filter parameters)

## Output

### skymap

#### skymap

Defines drawing function and draws the skymap

**Parameters**

-   `stringout` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** all filtered event data<p> format: (input format later)

## Processing

### customReader

#### customReader

Handles user inputted files

**Parameters**

-   `input` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

### text

## Utility

### isSelected

Returns true if file has been selected by the user, false if otherwise

**Parameters**

-   `kind` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** kind/category of file (accepted kinds: 'neutrino', 'gamma-ray', 'source', 'other')
-   `filename` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** given name of file

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### toDegrees

Utility

**Parameters**

-   `angle` **float** in radians

Returns **float** angle in degrees

### toRadians

Utility

**Parameters**

-   `angle` **float** in degrees

Returns **float** angle in radians

## Analysis
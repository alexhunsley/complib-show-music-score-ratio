# Complib music ratio display

This is a Userscripts plugin for making [Complib](https://complib.org) show a *music ratio* next to the Music score.

Music ratio is just the average music score per row (think of it as 'bang for your buck'):

```
                        music score
       music ratio =  ---------------
                       number of rows
```

# Example

Here's some complib search results without the plugin (sorted by MusicScore):

![Complib screenshot without plugin showing just the usual Music score](images/complib_default.png)

With the plugin installed, when sorting by MusicScore, the Music column shows (and sorts by) the ratio; the music score is now shown in brackets:

![Complib screenshot without plugin showing just the usual Music score](images/complib_music_ratio_plugin_sorted_by_ratio.png)

If you click the Music header we toggle back to sorting by music score (but the music ratio is still shown in brackets):

![Complib screenshot without plugin showing just the usual Music score](images/complib_music_ratio_plugin_sorted_by_music_score.png)

**Note:** if you sort results by something other than MusicScore, no ratio will appear on the page.

# Installation

1. Install the Userscripts helper for whatever browser you run. 

2. Install the plugin by copying the file `complib-add-music-ratio.js` to the appropriate folder on your machine (the Userscripts helper will detail where).

## Installation example: Mac OS

1. Searching for 'userscripts' in the App Store and install it.

2. Copy `complib-add-music-ratio.js` to folder `~/Library/Containers/com.userscripts.macos.Userscripts-Extension/Data/Documents/scripts`.

3. If asked, give permission for the userscripts plugin to access the site `complib.org`

## Afterthoughts

* tested on Mac OS Safari
* not sure of feasibility of running on mobile


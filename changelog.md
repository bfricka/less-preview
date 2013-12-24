# Changelog

### 0.0.8
  - Fix issue where error of type `File` (e.g. 404 on @import) kills the parser until refresh.
  - Clean-up modules and upgrade AngularJS to 1.2.6 and Lodash to 2.4.1
  - Update Less to 1.5.1

### 0.0.7
  - Huge refactor / mess reduction
  - Fixed LESS core stuff from 1.4
  - Lots of styling improvements

### 0.0.6
  - Major changes to build
  - Converted to from Coffee to full JS
  - Rename `strictMaths` to `strictMath` per LESS 1.4 beta

### 0.0.5
  - Added "Legacy Maths/Units" for LESS 1.4 compatibility.
  - Upgraded Grunt and all Grunt-contrib to 0.4.0 stable
  - Various tweaks and improvements

### 0.0.4
  - Converted site to AngularJS for a better framework to manage future feature additions
  - Removed highlight.js
  - Both input and output use CodeMirror editors now for line-numbers and easily selectable CSS
  - Some styling and performance tweaks

### 0.0.3
  - Added options drawer for better control
  - Cleaned up build process
  - Added middleware for better performance / security

### 0.0.2
  - No longer running on gh-pages.
  - Re-wrote with Express and Coffeescript
  - Grunt build
  - Added pre-release LESS

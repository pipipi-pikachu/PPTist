# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to([https://semver.org/spec/v2.0.0.html](https://semver.org/spec/v2.0.0.html)).


## [v2.1.0] - 2025-03-24

### Added
- Created new component `src/views/Editor/Remark/License.vue` for displaying LICENSE popup.

### Changed
- Changed footer to include `LICENSE` that provides more information about the license of the product
- Incremented version in `package.json`, `package-lock.json`.

### Fixed
- 

### Removed
-

## [v2.1.0] - 2025-03-24

### Added
- Added local server that can serve the demo presentation json data

### Changed
- Incremented version in `package.json`, `package-lock.json`.
- Moved attribution and copyright to bottom.
- Hidden Slide Number at left-hand side bottom
- Commented out Vue code for remarks, as it was hidden.
- Fixed layout due to changes to `remarks` footer.
- Changed slide number to appear above the slide in thumbnail left-hand sidebar.
- Changed variable values for theme.
- Increased width of the thumbnail sidebar to 200px.
- Changed background to $lightGray, commented out border-top css rule for bottom-center container.
- Updated $borderColor: darken(#FCFCFF, 2%)
- Installed `express` dependency for local server.
- Changed styling for `right-hand-sidebar` tabs section header, by adding `border-bottom: 1px solid $borderColor`.
- Updated `right-hand-sidebar`  to have better background contrast for new theme.
- Restyled `views/Editor/` to showcase more modernistic styling. (By adding repeating backgroun, making most of the web app have transparent background, updated position of certain menu actions that were visible in top menu bars)
- Updated structure for `CanvasTool` and `New Slide / Template` controls
- Hidden the title input field in `top-left menu bar`.
- Hidden Hamburger menu in top right section of EditorHeader component.
- Updated styling of `add-slide` block within `Editro/Thumbnails/index.vue`, as well moved hamburger menu to the newly structured menu.


## [v2.0.2] - 2025-03-23

### Changed
- Incremented version in `package.json`, `package-lock.json`.
- Hidden `Annotation Panel` control.
- Hidden exports of `PPTist, pptx, image, json` to keep only PDF export.
- Set PDF export as default when clicking `Export`.
- Hidden `AI` control in the top bar.
- Hidden `Insert Audio and Video ` control in the top bar.
- Hidden `Generate AI PPT` control from `left-hand` side top bar menu.
- Hidden `Import pptx files(beta), Import pptist file, Reset Slideshow` controls from `left-hand` side top bar menu.
- Changed label of `Exporting Files` to `Export` within `right-hand` side top bar menu.
- Changed export type to `pdf` when clicking `Export` within top-left control bar.
- Hidden `Reset slideshow` within left top-bar menu. 
- Hidden `Slide type label` within left top-bar menu.
- Hidden `Feedback` within left top-bar menu.
- Hidden `Frequently asked questions` within left top-bar menu.
- Hidden `Switch, Animation` from `right-hand sidebar`. 
- Hidden `Insert forumula` from center menu within top bar.
- Hidden `Start from scratch, Start from current page` from top right-hand sidebar menu.
- Hidden `Editor for Remarks` bottom center Editor for remarks.


## [v2.0.1] - 2025-03-23

### Added
- Added `changelog.md` to track all changes done to this repository.

### Changed
- Translated `index.html` to english.
- Translated `src/App.vue` to english.
- Translated `src/components/ColorPicker/index.vue` to english.
- Translated `src/components/LaTeXEditor/index.vue` to english.
- Translated `src/components/OutlineEditor.vue` to english.
- Translated `src/components/Select.vue` to english.
- Translated `src/configs/animation.ts` to english.
- Translated `src/configs/chart.ts` to english.
- Translated `src/configs/element.ts` to english.
- Translated `src/configs/font.ts` to english.
- Translated `src/configs/hotkey.ts` to english.
- Translated `src/configs/imageClip.ts` to english.
- Translated `src/configs/latex.ts` to english.
- Translated `src/configs/lines.ts` to english.
- Translated `src/configs/shapes.ts` to english.
- Translated `src/configs/symbol.ts` to english.
- Translated `src/hooks/useExport.ts` to english.
- Translated `src/hooks/useImport.ts` to english.
- Translated `src/hooks/useLink.ts` to english.
- Translated `src/hooks/useSearch.ts` to english.
- Translated `src/services/config.ts` to english.
- Translated `src/store/slides.ts` to english.
- Translated `src/utils/clipboard.ts` to english.
- Translated `src/views/components/element/TableElement/EditableTable.vue` to english.
- Translated `src/views/components/element/TableElement/index.vue` to english.
- Translated `src/views/components/element/VideoElement/VideoPlayer/index.vue` to english.
- Translated `src/views/components/element/ProsemirrorEditor.vue` to english.
- Translated `src/views/components/ThumbnailSlide/index.vue` to english.
- Translated `src/views/Editor/Canvas/Operate/LinkHandler.vue` to english.
- Translated `src/views/Editor/Canvas/EditableElement.vue` to english.
- Translated `src/views/Editor/Canvas/index.vue` to english.
- Translated `src/views/Editor/Canvas/LinkDialog.vue` to english.
- Translated `src/views/Editor/Canvas/ShapeCreateCanvas.vue` to english.
- Translated `src/views/Editor/CanvasTool/index.vue` to english.
- Translated `src/views/Editor/CanvasTool/MediaInput.vue` to english.
- Translated `src/views/Editor/CanvasTool/TableGenerator.vue` to english.
- Translated `src/views/Editor/EditorHeader/index.vue` to english.
- Translated `src/views/Editor/ExportDialog/ExportImage.vue` to english.
- Translated `src/views/Editor/ExportDialog/ExportJSON.vue` to english.
- Translated `src/views/Editor/ExportDialog/ExportPDF.vue` to english.
- Translated `src/views/Editor/ExportDialog/ExportPPTX.vue` to english.
- Translated `src/views/Editor/ExportDialog/ExportSpecificFile.vue` to english.
- Translated `src/views/Editor/ExportDialog/index.vue` to english.
- Translated `src/views/Editor/Remark/Editor.vue` to english.
- Translated `src/views/Editor/Thumbnails/index.vue` to english.
- Translated `src/views/Editor/Thumbnails/Templates.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementColorMask.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementFilter.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementFlip.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementOpacity.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementOutline.vue` to english.
- Translated `src/views/Editor/Toolbar/common/ElementShadow.vue` to english.
- Translated `src/views/Editor/Toolbar/common/RichTextBase.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/ChartStylePanel/ChartDataEditor.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/ChartStylePanel/index.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/AudioStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/ImageStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/LatexStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/LineStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/ShapeStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/TableStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/TextStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementStylePanel/VideoStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/SlideDesignPanel/index.vue` to english.
- Translated `src/views/Editor/Toolbar/SlideDesignPanel/ThemeColorsSetting.vue` to english.
- Translated `src/views/Editor/Toolbar/SlideDesignPanel/ThemeStylesExtract.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementAnimationPanel.vue` to english.
- Translated `src/views/Editor/Toolbar/ElementPositionPanel.vue` to english.
- Translated `src/views/Editor/Toolbar/index.vue` to english.
- Translated `src/views/Editor/Toolbar/MultiPositionPanel.vue` to english.
- Translated `src/views/Editor/Toolbar/MultiStylePanel.vue` to english.
- Translated `src/views/Editor/Toolbar/SlideAnimationPanel.vue` to english.
- Translated `src/views/Editor/AIPPTDialog.vue` to english.
- Translated `src/views/Editor/MarkupPanel.vue` to english.
- Translated `src/views/Editor/NotesPanel.vue` to english.
- Translated `src/views/Editor/SearchPanel.vue` to english.
- Translated `src/views/Editor/SelectPanel.vue` to english.
- Translated `src/views/Mobile/MobileEditor/ElementToolbar.vue` to english.
- Translated `src/views/Mobile/MobileEditor/Header.vue` to english.
- Translated `src/views/Mobile/MobileEditor/SlideToolbar.vue` to english.
- Translated `src/views/Mobile/MobilePlayer.vue` to english.
- Translated `src/views/Mobile/MobilePreview.vue` to english.
- Translated `src/views/Screen/hooks/useExecPlay.ts` to english.
- Translated `src/views/Screen/BaseView.vue` to english.
- Translated `src/views/Screen/CountdownTimer.vue` to english.
- Translated `src/views/Screen/PresenterView.vue` to english.
- Translated `src/views/Screen/WritingBoardTool.vue` to english.
- Incremented version in `package.json`, `package-lock.json`.
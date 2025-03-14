import { createVNode as _createVNode } from "vue";
import { IconWrapper } from '../runtime';
export default IconWrapper('direction', false, function (props) {
  return _createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [_createVNode("g", {
    "clip-path": 'url(#' + props.id + 'c8093ca4' + ')'
  }, [_createVNode("rect", {
    "x": "6.00049",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), _createVNode("path", {
    "d": "M23.293 10.5649L20.0504 13.8075C19.4204 14.4375 19.8666 15.5146 20.7575 15.5146H27.2428C28.1337 15.5146 28.5798 14.4375 27.9499 13.8075L24.7072 10.5649C24.3167 10.1744 23.6835 10.1744 23.293 10.5649Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M10.5649 24.707L13.8075 27.9496C14.4375 28.5796 15.5146 28.1334 15.5146 27.2425V20.7572C15.5146 19.8663 14.4375 19.4202 13.8075 20.0501L10.5649 23.2928C10.1744 23.6833 10.1744 24.3165 10.5649 24.707Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M24.707 37.4351L27.9496 34.1925C28.5796 33.5625 28.1334 32.4854 27.2425 32.4854H20.7572C19.8663 32.4854 19.4202 33.5625 20.0501 34.1925L23.2928 37.4351C23.6833 37.8256 24.3165 37.8256 24.707 37.4351Z",
    "fill": props.colors[2]
  }, null), _createVNode("path", {
    "d": "M37.4351 23.293L34.1925 20.0504C33.5625 19.4204 32.4854 19.8666 32.4854 20.7575V27.2428C32.4854 28.1337 33.5625 28.5798 34.1925 27.9499L37.4351 24.7072C37.8256 24.3167 37.8256 23.6835 37.4351 23.293Z",
    "fill": props.colors[2]
  }, null)]), _createVNode("defs", null, [_createVNode("clipPath", {
    "id": props.id + 'c8093ca4'
  }, [_createVNode("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});
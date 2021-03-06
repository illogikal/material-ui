'use strict';

var React = require('react');
var CssEvent = require('./utils/css-event');
var StylePropable = require('./mixins/style-propable');
var Transitions = require('./styles/transitions');
var ClickAwayable = require('./mixins/click-awayable');
var FlatButton = require('./flat-button');

var Snackbar = React.createClass({
  displayName: 'Snackbar',

  mixins: [StylePropable, ClickAwayable],

  manuallyBindClickAway: true,

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    action: React.PropTypes.string,
    message: React.PropTypes.string.isRequired,
    openOnMount: React.PropTypes.bool,
    onActionTouchTap: React.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      open: this.props.openOnMount || false
    };
  },

  componentClickAway: function componentClickAway() {
    this.dismiss();
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.open != this.state.open) {
      if (this.state.open) {
        //Only Bind clickaway after transition finishes
        CssEvent.onTransitionEnd(React.findDOMNode(this), (function () {
          this._bindClickAway();
        }).bind(this));
      } else {
        this._unbindClickAway();
      }
    }
  },

  getTheme: function getTheme() {
    return this.context.muiTheme.component.snackbar;
  },

  getSpacing: function getSpacing() {
    return this.context.muiTheme.spacing;
  },

  getStyles: function getStyles() {
    var styles = {
      root: {
        color: this.getTheme().textColor,
        backgroundColor: this.getTheme().backgroundColor,
        borderRadius: 2,
        padding: '0px ' + this.getSpacing().desktopGutter + 'px',
        height: this.getSpacing().desktopSubheaderHeight,
        lineHeight: this.getSpacing().desktopSubheaderHeight + 'px',
        minWidth: 288,
        maxWidth: 568,

        position: 'fixed',
        zIndex: 10,
        bottom: this.getSpacing().desktopGutter,
        marginLeft: this.getSpacing().desktopGutter,

        left: -10000,
        opacity: 0,
        transform: 'translate3d(0, 20px, 0)',
        transition: Transitions.easeOut('0ms', 'left', '400ms') + ',' + Transitions.easeOut('400ms', 'opacity') + ',' + Transitions.easeOut('400ms', 'transform') },
      action: {
        color: this.getTheme().actionColor,
        float: 'right',
        marginTop: 6,
        marginRight: -16,
        marginLeft: this.getSpacing().desktopGutter,
        backgroundColor: 'transparent'
      },
      rootWhenOpen: {
        left: '0px',
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        transition: Transitions.easeOut('0ms', 'left', '0ms') + ',' + Transitions.easeOut('400ms', 'opacity', '0ms') + ',' + Transitions.easeOut('400ms', 'transform', '0ms')
      }
    };
    return styles;
  },

  render: function render() {

    var styles = this.getStyles();

    var action;
    if (this.props.action) {
      action = React.createElement(FlatButton, {
        style: styles.action,
        label: this.props.action,
        onTouchTap: this.props.onActionTouchTap });
    }

    var rootStyles = styles.root;
    if (this.state.open) rootStyles = this.mergeStyles(styles.root, styles.rootWhenOpen, this.props.style);

    return React.createElement(
      'span',
      { style: rootStyles },
      React.createElement(
        'span',
        null,
        this.props.message
      ),
      action
    );
  },

  show: function show() {
    this.setState({ open: true });
  },

  dismiss: function dismiss() {
    this.setState({ open: false });
  }

});

module.exports = Snackbar;
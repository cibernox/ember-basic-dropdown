import Modifier from 'ember-modifier'
import { action } from '@ember/object'
import hasMoved from '../utils/has-moved'
import { Dropdown } from '../components/basic-dropdown'

interface Args {
  positional: []
  named: {
    dropdown: Dropdown
    eventType: 'click' | 'mousedown'
    stopPropagation: boolean
    onBlur?: (dropdown?: Dropdown, event?: FocusEvent) => void
    onClick?: (dropdown?: Dropdown, event?: MouseEvent) => void
    onFocus?: (dropdown?: Dropdown, event?: FocusEvent) => void
    onFocusIn?: (dropdown?: Dropdown, event?: FocusEvent) => void
    onFocusOut?: (dropdown?: Dropdown, event?: FocusEvent) => void
    onKeyDown?: (dropdown?: Dropdown, event?: KeyboardEvent) => void
    onMouseDown?: (dropdown?: Dropdown, event?: MouseEvent) => void
    onMouseEnter?: (dropdown?: Dropdown, event?: MouseEvent) => void
    onMouseLeave?: (dropdown?: Dropdown, event?: MouseEvent) => void
    onTouchEnd?: (dropdown?: Dropdown, event?: TouchEvent) => void
  }
}

export default class DropdownTriggerModifier extends Modifier<Args> {
  private toggleIsBeingHandledByTouchEvents = false

  private touchMoveEvent?: TouchEvent

  didInstall() {
    this.element.setAttribute('data-ebd-id', `${this.args.named.dropdown.uniqueId}-trigger`)

    this.element.addEventListener('click', this.onClick, true)
    this.element.addEventListener('mousedown', this.onMouseDown, true)
    this.element.addEventListener('keydown', this.onKeyDown, true)
    this.element.addEventListener('touchstart', this.onTouchStart, true)
    this.element.addEventListener('touchend', this.onTouchEnd, true)
  }

  @action
  onMouseDown(e: MouseEvent): void {
    if (this.args.named.dropdown.disabled) {
      return
    }
    if (this.args.named.eventType !== 'mousedown' || e.button !== 0) return
    if (this.args.named.stopPropagation) {
      e.stopPropagation()
    }
    this._stopTextSelectionUntilMouseup()
    if (this.toggleIsBeingHandledByTouchEvents) {
      // Some devises have both touchscreen & mouse, and they are not mutually exclusive
      // In those cases the touchdown handler is fired first, and it sets a flag to
      // short-circuit the mouseup so the component is not opened and immediately closed.
      this.toggleIsBeingHandledByTouchEvents = false
      return
    }
    this.args.named.dropdown.actions.toggle(e)
  }

  @action
  onClick(e: MouseEvent): void {
    if (typeof document === 'undefined') return
    if (this.isDestroyed || !this.args.named.dropdown || this.args.named.dropdown.disabled) {
      return
    }
    if ((this.args.named.eventType !== undefined && this.args.named.eventType !== 'click') || e.button !== 0) return
    if (this.args.named.stopPropagation) {
      e.stopPropagation()
    }
    if (this.toggleIsBeingHandledByTouchEvents) {
      // Some devises have both touchscreen & mouse, and they are not mutually exclusive
      // In those cases the touchdown handler is fired first, and it sets a flag to
      // short-circuit the mouseup so the component is not opened and immediately closed.
      this.toggleIsBeingHandledByTouchEvents = false
      return
    }
    this.args.named.dropdown.actions.toggle(e)
  }

  @action
  onKeyDown(e: KeyboardEvent): void {
    if (this.args.named.dropdown.disabled) {
      return
    }
    if (e.keyCode === 13) {
      // Enter
      this.args.named.dropdown.actions.toggle(e)
    } else if (e.keyCode === 32) {
      // Space
      e.preventDefault() // prevents the space to trigger a scroll page-next
      this.args.named.dropdown.actions.toggle(e)
    } else if (e.keyCode === 27) {
      this.args.named.dropdown.actions.close(e)
    }
  }

  @action
  onTouchStart(): void {
    document.addEventListener('touchmove', this._touchMoveHandler)
  }

  @action
  onTouchEnd(e: TouchEvent): void {
    this.toggleIsBeingHandledByTouchEvents = true
    if ((e && e.defaultPrevented) || this.args.named.dropdown.disabled) {
      return
    }
    if (!hasMoved(e, this.touchMoveEvent)) {
      this.args.named.dropdown.actions.toggle(e)
    }
    this.touchMoveEvent = undefined
    document.removeEventListener('touchmove', this._touchMoveHandler)
    // This next three lines are stolen from hammertime. This prevents the default
    // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
    // to simulate natural behaviour.
    const target = e.target as HTMLElement
    if (target !== null) {
      target.focus()
    }
    setTimeout(function () {
      if (!e.target) {
        return
      }
      try {
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        e.target.dispatchEvent(event)
      } catch (err) {
        const event = new Event('click')
        e.target.dispatchEvent(event)
      }
    }, 0)
    e.preventDefault()
  }

  willRemove(): void {
    if (typeof document === 'undefined') return
    document.removeEventListener('touchmove', this._touchMoveHandler)
    document.removeEventListener('mouseup', this._mouseupHandler, true)

    this.element.removeEventListener('click', this.onClick, true)
    this.element.removeEventListener('mousedown', this.onMouseDown, true)
    this.element.removeEventListener('keydown', this.onKeyDown, true)
    this.element.removeEventListener('touchstart', this.onTouchStart, true)
    this.element.removeEventListener('touchend', this.onTouchEnd, true)
  }

  @action
  _mouseupHandler(): void {
    document.removeEventListener('mouseup', this._mouseupHandler, true)
    document.body.classList.remove('ember-basic-dropdown-text-select-disabled')
  }

  @action
  _touchMoveHandler(e: TouchEvent): void {
    this.touchMoveEvent = e
    document.removeEventListener('touchmove', this._touchMoveHandler)
  }

  // Methods
  _stopTextSelectionUntilMouseup(): void {
    document.addEventListener('mouseup', this._mouseupHandler, true)
    document.body.classList.add('ember-basic-dropdown-text-select-disabled')
  }
}

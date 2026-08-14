import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// The web implementation of @capacitor/haptics falls back to the Vibration API (or does
// nothing where unsupported), so these are safe to call unconditionally on every platform
// -- always swallow errors so a haptics failure never breaks the action it's attached to.

/** A light tap for discrete selections -- choosing a tile, toggling a filter. */
export function hapticSelect() {
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}

/** A slightly firmer tap for save/unsave toggles. */
export function hapticToggle() {
  Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
}

/** A success notification for completed generation/confirmation moments (a result is ready, a plan is generated, a share succeeded). */
export function hapticSuccess() {
  Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

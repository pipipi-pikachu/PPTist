import { initLocale } from './i18n'

// Load translations before module-level configuration and component labels.
initLocale().then(() => import('./bootstrap'))

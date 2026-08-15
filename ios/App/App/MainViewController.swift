import UIKit
import Capacitor

// Capacitor's default WKWebView doesn't enable the standard iOS edge-swipe
// back gesture. The web app relies entirely on the browser's own back
// button (it has none of its own), which doesn't exist in the native shell -
// without this, there's no way back from a detail page except the bottom
// tabs, which jump to a hub root rather than going back one step. WKWebView
// tracks React Router's pushState/replaceState calls in its own
// back-forward list the same way desktop Safari does, so this "just works"
// with the existing routing - no web-side changes needed.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        webView?.allowsBackForwardNavigationGestures = true
    }
}

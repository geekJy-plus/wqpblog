/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "34a23645a63f31239fa6c79d87e9caba"
  },
  {
    "url": "about.html",
    "revision": "0da47902fac37a814965587be0f992f9"
  },
  {
    "url": "about/index.html",
    "revision": "5bf3799ceed7b428ac06d791ebef565f"
  },
  {
    "url": "assets/css/0.styles.1ab949f2.css",
    "revision": "e18ca8e87db1cea8bc03f6c8b1b5b578"
  },
  {
    "url": "assets/img/functhree.6489d914.png",
    "revision": "6489d9141a4593e455a2327ae96d055d"
  },
  {
    "url": "assets/img/functhree.png",
    "revision": "6489d9141a4593e455a2327ae96d055d"
  },
  {
    "url": "assets/img/hero.png",
    "revision": "ba47feffd04fa87858a291b7d69c9645"
  },
  {
    "url": "assets/img/hljdx.png",
    "revision": "3a1ec73376cc3dc0f569f549df0a6b5a"
  },
  {
    "url": "assets/img/lifecycle.d43d86dd.png",
    "revision": "d43d86ddd4e95dbe125768a39b7572cf"
  },
  {
    "url": "assets/img/lifecycle.png",
    "revision": "d43d86ddd4e95dbe125768a39b7572cf"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/this.0764d053.png",
    "revision": "0764d05375793629dfe5ce2863cddd74"
  },
  {
    "url": "assets/img/this.png",
    "revision": "0764d05375793629dfe5ce2863cddd74"
  },
  {
    "url": "assets/js/10.a6aaabec.js",
    "revision": "f15a1aca284682df898ca65ceeab0e75"
  },
  {
    "url": "assets/js/11.2dffb2f3.js",
    "revision": "f09d7dacc72d720c0303e8fb15a67532"
  },
  {
    "url": "assets/js/12.7bed0eb7.js",
    "revision": "b89631416344f709f125fa2161931a8e"
  },
  {
    "url": "assets/js/13.444ca3ea.js",
    "revision": "b7a93d33327c813842f6e8a0a1f3698b"
  },
  {
    "url": "assets/js/14.b435b594.js",
    "revision": "d69db84d43dde585fe9cd6aa727beee7"
  },
  {
    "url": "assets/js/15.58653fc2.js",
    "revision": "674097aeffd7ab76150b9953f766716a"
  },
  {
    "url": "assets/js/16.1a169680.js",
    "revision": "edb7e32554c08c3e541be884195f3695"
  },
  {
    "url": "assets/js/17.222da58b.js",
    "revision": "eeb60c9532fb9abd3ff7f62d42c123a5"
  },
  {
    "url": "assets/js/18.0afd1c98.js",
    "revision": "4e84a016f6452a24f07091c46ab9643e"
  },
  {
    "url": "assets/js/19.376536ee.js",
    "revision": "c5823e75ff6bcc8c96ffec7415e6c8f1"
  },
  {
    "url": "assets/js/2.bae677bb.js",
    "revision": "79fd1847a16ee2c4002cab04bab50ef8"
  },
  {
    "url": "assets/js/20.58e59de3.js",
    "revision": "27274cdbd9b518815e6d64b4fd866dee"
  },
  {
    "url": "assets/js/21.57cdb735.js",
    "revision": "1b9eafc5382d83bd0eac457b46399b51"
  },
  {
    "url": "assets/js/22.aed53b90.js",
    "revision": "58ee4b38c03efb10088655552525b75e"
  },
  {
    "url": "assets/js/23.0939af80.js",
    "revision": "c376b106e2a57a681e432fd0bd0c6c5e"
  },
  {
    "url": "assets/js/24.260c84e1.js",
    "revision": "9265c260d9143021d2e3b9138f2c57a9"
  },
  {
    "url": "assets/js/3.c2a584cc.js",
    "revision": "03a63705b8fa32da2efa3c60859a413f"
  },
  {
    "url": "assets/js/4.eed2e106.js",
    "revision": "0e6056556c893793ea645edf6529afdc"
  },
  {
    "url": "assets/js/5.0965dde3.js",
    "revision": "4bcae541a56c3359a034f15db940bf5d"
  },
  {
    "url": "assets/js/6.57611cc0.js",
    "revision": "dde68452fcca8062a1e63173cddc9fe7"
  },
  {
    "url": "assets/js/7.757f8de8.js",
    "revision": "db81f0dc4d9268affba49c82d86810d2"
  },
  {
    "url": "assets/js/8.f7203bfb.js",
    "revision": "9ced2100c4655c8868a037199aa38ace"
  },
  {
    "url": "assets/js/9.7683184d.js",
    "revision": "8c846001b71334e43d648efdfdd42a0f"
  },
  {
    "url": "assets/js/app.3fedd56f.js",
    "revision": "f5e575b35ada554677b798dbe0c0612a"
  },
  {
    "url": "bar/four.html",
    "revision": "f8e9bed3dc1d8529cff4db716400be73"
  },
  {
    "url": "bar/index.html",
    "revision": "5d7e689e62b77117d2098e5edae07523"
  },
  {
    "url": "bar/three.html",
    "revision": "9a27bedb804d08bbd941e175ec0631c2"
  },
  {
    "url": "basic/index.html",
    "revision": "c6a9c2e955c6327a0e90a52c2a0e7906"
  },
  {
    "url": "c_ss/index.html",
    "revision": "81174873b4594a7f9917c164e61f57d7"
  },
  {
    "url": "category.html",
    "revision": "9b711e42a368815ddcb5dd1cd6cb46d8"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "f130a0b70e386170cf6f011c0ca8c4f4"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "0ff1bc4d14e5c9abcacba7c600d97814"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "936d6e411cabd71f0e627011c3f18fe2"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "1a034e64d80905128113e5272a5ab95e"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "c43cd371a49ee4ca17ab3a60e72bdd51"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "9a2b5c0f19de617685b7b5b42464e7db"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "af28d69d59284dd202aa55e57227b11b"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "66830ea6be8e7e94fb55df9f7b778f2e"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "4bb1a55479d61843b89a2fdafa7849b3"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "98b614336d9a12cb3f7bedb001da6fca"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "b89032a4a5a1879f30ba05a13947f26f"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "058a3335d15a3eb84e7ae3707ba09620"
  },
  {
    "url": "icons/safari-pinned-tab.svg",
    "revision": "f22d501a35a87d9f21701cb031f6ea17"
  },
  {
    "url": "index.html",
    "revision": "9be7aa92eb60bd07e38d640920e19a64"
  },
  {
    "url": "interview/index.html",
    "revision": "6d5c2a0e6cb5fd14eefa4d7caf45b7d5"
  },
  {
    "url": "jsup/index.html",
    "revision": "bd05432ca8e21fb42ed0ddce83b7771e"
  },
  {
    "url": "vue/day1.html",
    "revision": "72a848171c2e896af361b73e97c001cd"
  },
  {
    "url": "vue/day2.html",
    "revision": "c56f95d22e5187881e8e51d98fb36f2b"
  },
  {
    "url": "vue/day3.html",
    "revision": "28a77f09bb85491ff01826ba97effa78"
  },
  {
    "url": "vue/index.html",
    "revision": "a941fe592b545a1536cb838acc8ef4e8"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})

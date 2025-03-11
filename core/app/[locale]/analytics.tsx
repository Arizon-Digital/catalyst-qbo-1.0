"use client"

export default function GoogleAnalytics({ channelId }: { channelId: string }) {
  if (channelId != "1679851") {
    return null
  }

  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-5ZJM1FZ432"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
      function gtag(){
        dataLayer.push(arguments)
      }
      gtag('js', new Date()); gtag('config', 'G-5ZJM1FZ432'); `,
      }} />
    </>
  )
}
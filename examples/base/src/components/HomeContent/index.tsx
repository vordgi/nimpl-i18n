import ServerTranslation from 'next-translation/ServerTranslation'

export default function HomeContent() {
  return (
    <section style={{ marginTop: 60, marginBottom: 60 }}>
      <p>
        <ServerTranslation
          term="homeContent.title"
          components={{
            link: (
              <a href="https://github.com/vordgi/next-translation/examples/base/src/app/%5Blang%5D/page.tsx" />
            ),
          }}
        />
      </p>
    </section>
  )
}

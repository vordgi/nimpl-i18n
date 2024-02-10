import getTranslation from 'next-translation/getTranslation'
import ServerTranslation from 'next-translation/ServerTranslation'

export default function Intro({ page }: { page: string }) {
  const { t } = getTranslation()

  return (
    <section style={{ marginTop: 60, marginBottom: 60 }}>
      <h1>{t('intro.title', { query: { page } })}</h1>
      <p>
        <ServerTranslation
          term="intro.description"
          components={{
            getterLink: (
              <a href="https://github.com/vordgi/next-translation?tab=readme-ov-file#server-components" />
            ),
            componentLink: (
              <a href="https://github.com/vordgi/next-translation?tab=readme-ov-file#server-components" />
            ),
          }}
        />
      </p>
    </section>
  )
}

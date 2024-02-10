import ServerTranslation from 'next-translation/ServerTranslation'

export default function ContactsContent() {
  return (
    <section style={{ marginTop: 60, marginBottom: 60 }}>
      <p>
        <ServerTranslation
          term="contactsContent.title"
          components={{
            link: (
              <a href="https://github.com/vordgi/next-translation/examples/base/src/app/%5Blang%5D/contacts/page.tsx" />
            ),
          }}
        />
      </p>
    </section>
  )
}

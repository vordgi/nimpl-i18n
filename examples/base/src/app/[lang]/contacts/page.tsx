import LocaleSelect from '../../../components/LocaleSelect'
import Nav from '../../../components/Nav'
import Intro from '../../../components/Intro'
import ContactsContent from '../../../components/ContactsContent'
import Additional from '../../../components/Additional'
import NextTranlationProvider from 'next-translation/NextTranlationProvider'
import createTranslation from 'next-translation/createTranslation'

export default async function Contacts({ params }: { params: { lang: string } }) {
  return (
    <NextTranlationProvider lang={params.lang} clientTerms={[]}>
      <main>
        <LocaleSelect />
        <Nav />
        <Intro page="contacts" />
        <ContactsContent />
        <Additional page="contacts" />
      </main>
    </NextTranlationProvider>
  )
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { t } = await createTranslation(params.lang);

  return {
    title: t('contactsPage.meta.title'),
  }
}

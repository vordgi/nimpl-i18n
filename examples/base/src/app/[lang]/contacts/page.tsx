import LocaleSelect from '../../../components/LocaleSelect'
import Nav from '../../../components/Nav'
import Intro from '../../../components/Intro'
import ContactsContent from '../../../components/ContactsContent'
import Additional from '../../../components/Additional'
import I18nProvider from '@nimpl/i18n/I18nProvider'
import createTranslation from '@nimpl/i18n/createTranslation'

export default async function Contacts({ params }: { params: { lang: string } }) {
  return (
    <I18nProvider lang={params.lang} clientTerms={[]}>
      <main>
        <LocaleSelect />
        <Nav />
        <Intro page="contacts" />
        <ContactsContent />
        <Additional page="contacts" />
      </main>
    </I18nProvider>
  )
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { t } = await createTranslation(params.lang);

  return {
    title: t('contactsPage.meta.title'),
  }
}

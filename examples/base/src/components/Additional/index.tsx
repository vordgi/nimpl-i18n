import getTranslation from 'next-translation/getTranslation'
import ServerTranslation from 'next-translation/ServerTranslation'
import NextTranlationTransmitter from 'next-translation/NextTranlationTransmitter'
import AdditionalHome from '../AdditionalHome'
import AdditionalContacts from '../AdditionalContacts'

export default function Additional({ page }: { page: string }) {
  const { t } = getTranslation()

  return (
    <section style={{ marginTop: 60, marginBottom: 60 }}>
      <p>{t('additional.needClientSideLogic')}</p>
      <p>
        <ServerTranslation
          term="additional.toTransfer"
          components={{
            link: (
              <a href="https://github.com/vordgi/next-translation?tab=readme-ov-file#client-components" />
            ),
          }}
        />
      </p>
      <p>{t('additional.additinalBonus')}</p>
      <p>
        {t('additional.onThisPage', {
          query: {
            component:
              page === 'home' ? 'AdditionalHome' : 'AdditionalContacts',
          },
        })}
      </p>
      {page === 'home' ? (
        <NextTranlationTransmitter terms={['additionalHome']}>
          <AdditionalHome />
        </NextTranlationTransmitter>
      ) : (
        <NextTranlationTransmitter terms={['additionalContacts']}>
          <AdditionalContacts />
        </NextTranlationTransmitter>
      )}
    </section>
  )
}

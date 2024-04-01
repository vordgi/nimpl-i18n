import getTranslation from '@nimpl/i18n/getTranslation'
import ServerTranslation from '@nimpl/i18n/ServerTranslation'
import NextTranlationTransmitter from '@nimpl/i18n/NextTranlationTransmitter'
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
              <a href="https://github.com/vordgi/nimpl-i18n?tab=readme-ov-file#client-components" />
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

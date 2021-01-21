import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

import { H2 as DefaultH2, Title } from '../components/Typography/Basic'
import Anchor from '../components/Icons/Anchor'
import slugify from 'slugify'
import ReverseRecordImageSrc from '../assets/reverseRecordImage.png'

const H2 = styled(DefaultH2)`
  margin-top: 50px;
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
  `}
`

const Question = styled('h3')`
  font-size: 15px;
  margin-right: 0.5em;
  display: inline;
`

const Answer = styled('p')``

const AnchorContainer = styled(`a`)``

const ImageContainer = styled('div')`
  margin: 2em;
`

const ReverseRecordImage = styled('img')`
  width: 100%;
  ${mq.medium`
    width: 600px;
  `}
`

const Section = ({ question, children }) => {
  let slug
  if (question) {
    slug = slugify(question, {
      lower: true
    })
  }
  return (
    <>
      <Question id={slug}>{question}</Question>
      <AnchorContainer href={`#${slug}`}>
        <Anchor />
      </AnchorContainer>

      <Answer>{children}</Answer>
    </>
  )
}

function Faq() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'ENS Faq'
  }, [])

  return (
    <FaqContainer>
      <Title>FAQ</Title>
      <H2>Before You register</H2>
      <Section question="Is ENS only for storing an Ethereum address?">
        No, you can store the addresses of many different cryptocurrencies, a
        content hash of a decentralized website, profile information such as an
        avatar and Twitter handle, and more.
      </Section>

      <Section question="Can I use an ENS name to point to my website?">
        Though ENS can technically store anything, there aren't many third party
        tools and applications which resolve IP addresses attached to ENS.
        <br />
        Instead, we suggest hosting your static html/css/images on IPFS and put
        the hash in your ENS name,s Content record. Then it can be resolved by
        ENS-aware browsers (e.g. Opera), browser extensions (Metamask), or any
        browser with ".link" appended to the end (e.g. matoken.eth.link).
      </Section>

      <Section question="What is the maximum length of a name I can register?">
        There is no limit on the name length.
      </Section>

      <Section question="Can you have names with emojis?">Yes.</Section>

      <Section question="How much does it cost to register?">
        Most names are $5 a year (paid in ETH), though shorter names (3 and 4
        characters) are more expensive as they are more rare.
        <br />
        Also, if the name was previously owned by someone but recently released,
        it has a temporary decreasing premium to prevent squatters snatching up
        names.
      </Section>

      <Section question="How much gas does it cost to register and renew?">
        It depends on the gas price. You can check the historical registration
        and renewal transaction costs
        <a href="https://explore.duneanalytics.com/public/dashboards/48pBVvSxRNVjSE8Ing1uOrCtjD4r3WmV0v5KpS05">
          {' '}
          here{' '}
        </a>
        . "Transaction cost (USD)" query will tell you how much it costs to
        register (commit + registerWithConfig) and renew.
        <br />
        Please bear in mind that "registerWithConfig" combines 3 transactions
        (register, set resolver and set eth address) hence the gas cost is
        reelatively expensive.
      </Section>

      <Section question="Can I register names other than .eth?">
        Yes, if you own DNS domains listed
        <a href="https://app.ens.domains/name/[root]/subdomains"> here </a>, you
        can use the DNS record as the proof to claim the equivalent ENS names.
        <br />
        Please refer to our{' '}
        <a href="https://docs.ens.domains/dns-registrar-guide">guiide</a> for
        more detail.
      </Section>

      <H2>When you register</H2>

      <Section question="At step 1, the transaction was slow so I speeded up">
        Our app cannot currently detect that you sped up the transaction. Please
        refresh the page and start from step 1 again.
      </Section>

      <Section question="I am stuck at step 2">
        At times, the counter waits for up to a minute at the end of step 2 to
        make sure that the Ethereum blockchain has progressed. If this continues
        for more than 5 min after moving to step 2, please contact us on
        Discord.
        <br />
        Note that if you leave it at step 2 for more than 24 hours, it gets
        reset and you have to start from step 1 again.
      </Section>

      <Section question="My transaction at step 3 failed">
        This happens occasionally when the USD price changes and you haven,t
        registered with enough ETH. Please try again from step3.
        <br />
        Please also be noted that the registration step will expire if you don't
        complete within 24 hrs and you have to start from step 1 again.
      </Section>

      <H2>After you register</H2>

      <Section question="What is the difference between the Registrant and Controller?">
        If your Ethereum address is set as the Controller you can change the
        resolver and add/edit records. Some dapps (eg: Fleek, OpenSea) set
        themselves as the Controller so they can update records on your behalf.
        <br />
        The Registrant only exists on ".eth" names and it allows you to change
        the Controller. If you transfer the Registrant to an address you don,t
        own, you lose the ownership of the name.
      </Section>

      <Section question="What is a Resolver?">
        A Resolver is a smart contract that holds records. Names are set by
        default to the Public Resolver managed by the ENS team and has all the
        standard ENS record types. You can set your Resolver to a custom
        resolver contract if you,d like.
      </Section>

      <Section question="What is a Reverse Record?">
        A Reverse Record makes your Ethereum address point to an ENS name
        (normally ENS names point to addresses, hence "reverse" record). This
        allows dapps to find and display your ENS name when you connect to them
        with your Ethereum account. This can only be set by you so it is not set
        automatically upon registration.
        <br />
        To set the reverse record, please click "My account", and select
        "Reverse Record".
        <ImageContainer>
          <ReverseRecordImage src={ReverseRecordImageSrc} />
        </ImageContainer>
      </Section>

      <Section question="How do I unregister my name?">
        If you click the "trash bin" icon on the address record, it will unset
        your address so that people can no longer look up your address with the
        name. You can also unset ownership of subdomains in this way, but you
        cannot do so on ".eth" addresses. Because ‘.eth` names are
        ERC721-compliant NFTs, you cannot transfer them to an empty address
        (0x00000...). You can transfer it to a burn address (eg: 0x00001), but
        that does not erase the fact that you used to own the name. Also, the
        name will not become available for registration again until the
        registration period and grace period runs out.
      </Section>

      <Section question="How do I transfer my name?">
        For a ".eth" name, transfer both the Registrant and the Controller to
        the new Ethereum account. Since ".eth" names are ERC721 compliant NFTs,
        you can change the Registrant by simply transferring the NFT from any
        NFT compliant wallet/marketplace as well.
        <br />
        For subdomains, click change the Controller to the new Ethereum account.
        Note that transferring the ownership of the name does not change the
        records, so the recipient may need to update them. If the recipient is
        not experienced, it may be a good idea for you to clear your records and
        set the ETH Address record to their Ethereum address before transferring
        the name.
      </Section>

      <Section question="Why are some of my subdomains shown as a jumble of characters?">
        ENS names are stored as a hash on-chain so we have to decode the name
        using a list of possible names, and it shows in the hashed format if we
        don,t have it on our list. You can still access and manage the name if
        you search for the name directly in the search bar.
      </Section>

      <Section question="How do I find the labelhash/namehash of a name?">
        Please refer to our{' '}
        <a href="https://docs.ens.domains/contract-api-reference/name-processing#how-do-i-find-the-labelhash-namehash-of-a-name">
          developer documentation page.
        </a>
      </Section>

      <H2>When you renew your registration</H2>

      <Section question="How do I receive a renewal reminder?">
        Click the "Remind me" button on the name,s page or your address page so
        that you can set a calendar reminder or email reminder. Note that you
        have to set calendar reminders per name, whereas you only need to set
        email reminders per the address of the owner. Also note that you can
        register a name for multiple years, removing the need to renew each
        year.
      </Section>

      <Section question="What happens if I forget to renew a name?">
        After your name expires, there is a 90 day grace period in which the
        owner can't edit the records but can still renew the name. After the
        grace period, the name is released for registration by anyone with a
        temporary premium which decreases over a 28 days period. The released
        name continues to resolve your ETH address until the new owner
        overwrites it.
      </Section>

      <Section question="I lost access to the Ethereum account that owns a name I registered. Can I still renew it?">
        Any Ethereum account can pay to renew any ENS name, though doing so from
        an account that, s not the owner will not change ownership of the name.
        Just go to the name,s page and click "Renew".
      </Section>

      <Section question="I registered names before 2019 May. Can I have my deposit back?">
        Yes, you can get your deposit back from
        <a href="https://reclaim.ens.domains"> reclaim.ens.domains </a> whether
        you renewed the name or not.
        <br />
        Please remember that the amount you will receive is the amount of the
        second-highest bidder (unless you were the only bidder). For example, if
        you bid 1 ETH and the second highest bidder bid 0.1 ETH, you deposited
        0.1 ETH and you have already received the remaining (0.9 ETH) when you
        finailsed the auction. Therefore you can now only reclaim 0.1 ETH back.
      </Section>
    </FaqContainer>
  )
}

const FaqContainer = styled('div')`
  margin: 1em;
  padding: 20px 40px;
  background-color: white;
`

export default Faq

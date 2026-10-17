import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

interface FAQStructuredData {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

interface Props {
  faqStructuredData: FAQStructuredData;
}

export const FAQs = ({ faqStructuredData }: Props) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <Accordions>
        {faqStructuredData.mainEntity.map((faq, index) => (
          <Accordion key={index} title={faq.name}>
            <div
              className="leading-8"
              dangerouslySetInnerHTML={{ __html: faq.acceptedAnswer.text }}
            />
          </Accordion>
        ))}
      </Accordions>
    </>
  );
};

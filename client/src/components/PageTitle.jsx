const SITE_TITLE = "Weblog";

export default function PageTitle({ title }) {
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;

  return <title>{fullTitle}</title>;
}

import { styled } from '@pigment-css/react';

import { loadContent } from '@/content.helpers';

export default async function Home() {
  const data = await loadContent();

  return <HomeWrapper>{data}</HomeWrapper>;
}

const HomeWrapper = styled.div`
  color: red;
`;

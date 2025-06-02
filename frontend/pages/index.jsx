import dynamic from 'next/dynamic'

const FashionUploadUI = dynamic(() => import('../src/components/FashionUploadUI'), { ssr: false });

export default function Home() {
  return <FashionUploadUI />;
}

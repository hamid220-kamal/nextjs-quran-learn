
import Navbar from '@/components/Navbar/Navbar';
import Footer from '../../components/Footer';
import RukuClientPage from './RukuClientPage';


export default async function RukuPage({ params }: { params: { rukuNumber: string } }) {
  // Await params if it's a promise (Next.js app dir dynamic route)
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const rukuNumber = Number(resolvedParams.rukuNumber);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-12">
      <Navbar />
      <div className="max-w-xl w-full mx-auto px-2 sm:px-4">
        <RukuClientPage rukuNumber={rukuNumber} />
      </div>
    </div>
  );
}


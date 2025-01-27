import { AlertTable } from '@/components/protected/professionals/AlertTable';
import {Navigation} from '@/components/protected/professionals/Navigations';

export default function Alerts() {
    return(
        <div>
           <div className="min-h-screen bg-gray-50">
                 <div
                   className="pb-48"
                   style={{
                     backgroundImage: 'url("/Background.png")',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                   }}
                 >
                   <div className="max-w-screen-lg mx-auto">
                     <Navigation />
           
                     <div className="p-6">
                       <div className="flex justify-between items-center mb-6">
                         <h1 className="text-2xl font-bold text-white">Patients</h1>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="max-w-screen-lg mx-auto -mt-40">
                   <div className="p-6 space-y-6">
                       <AlertTable/>
                 </div>
               </div>
             </div>
        </div>
    );
}

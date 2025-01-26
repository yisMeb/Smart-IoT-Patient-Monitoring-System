import { Navigation } from '@/components/protected/providers/Navigations';
import React from 'react';
import { User, Mail, MapPin } from "lucide-react";
import {
    Card
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
    const Address = "Addis Ababa, Ethiopia";
    const Email = "example@gmail.com";
    const iname = "St. John Hospital";

    return (
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
                      <h1 className="text-2xl font-bold text-white">Profile</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-screen-lg mx-auto -mt-40">
                <div className="p-6 space-y-6">
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                    <div className="relative bg-white rounded-xl p-6 transition-all duration-300 ease-out">
                        <div className="h-screen text-gray-500 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12">
                             {/* icon */}
                             <div className='flex justify-start items-center gap-3'>
                                <User size={100}/>
                                <section>
                                    <h3 className="text-3xl font-semibold tabular-nums">
                                       {iname}
                                    </h3>
                                    <div className='flex flex-row gap-3'>
                                        <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700"><span className='flex flex-row gap-2 text-center'><MapPin /> {Address}</span></p>
                                        <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700"><span className='flex flex-row gap-2 text-center'><Mail /> {Email}</span></p>
                                    </div>
                                </section>
                             </div>

                             {/* info */}
                             <div className='flex flex-col mt-5'>
                                <h1 className='font-bold'>Personal Info</h1>
                                <span>Update your details here.</span>
                                    {/* table */}
                                <div className='mt-5 max-w-screen-md'>
                                    <Card className='p-5'>
                                        <div className='mt-5'>
                                            <label htmlFor="name">Institution name</label>
                                            <Input type="name" placeholder={iname} className='w-72'/>
                                        </div>
                                        <div className='mt-5'>
                                            <label htmlFor="name">Email</label>
                                            <Input type="email" placeholder={Email} className='w-72'/>
                                        </div>
                                        <div className='mt-5 mb-8'>
                                            <label htmlFor="name">Address</label>
                                            <Input type="address" placeholder={Address} className='w-72'/>
                                        </div>

                                        {/* buttons */}
                                        <hr />
                                        <div className='mt-5 flex flex-row justify-end w-full'>
                                            <Button className='bg-white hover:bg-gray-100 text-black mr-2'>Cancel</Button>
                                            <Button className='bg-blue-500 text-white hover:bg-blue-600'>Save changes</Button>
                                        </div>
                                    </Card>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
      );
    };
export default Profile;
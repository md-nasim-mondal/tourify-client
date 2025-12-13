
import UpdateProfileForm from "@/components/modules/profile/UpdateProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, User, Quote } from "lucide-react";
import { getMyProfile } from "@/services/user/getMyProfile";

export default async function MyProfilePage() {
  const { data: me } = await getMyProfile();

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="relative">
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="relative -mt-16 px-6">
          <div className="flex flex-col items-center md:flex-row md:items-end gap-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={me?.photo} alt={me?.name} />
              <AvatarFallback className="text-2xl font-bold bg-slate-200">
                {me?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                {me?.name}
                <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                  {me?.role}
                </Badge>
              </h1>
              <p className="text-slate-500 font-medium">{me?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Bio</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {me?.bio || "No bio added yet."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="text-slate-700">{me?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Contact</p>
                  <p className="text-slate-700">{me?.contactNo || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Address</p>
                  <p className="text-slate-700">{me?.address || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Update Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UpdateProfileForm me={me} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

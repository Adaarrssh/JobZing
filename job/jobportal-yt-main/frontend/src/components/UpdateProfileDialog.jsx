import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { saveRegisteredUser } from "@/utils/mockData";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    profilePhoto: null,
    resume: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: Array.isArray(user.profile?.skills) ? user.profile.skills.join(", ") : "",
        profilePhoto: null,
        resume: null,
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fileChangeHandler = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setInput({
        ...input,
        [name]: files[0],
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname.trim()) {
      return toast.error("Full Name is required");
    }

    if (!input.email.trim()) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const parsedSkills = input.skills
        ? input.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      let updatedUser = {
        ...user,
        fullname: input.fullname,
        email: input.email,
        phoneNumber: input.phoneNumber,
        profile: {
          ...(user?.profile || {}),
          bio: input.bio,
          skills: parsedSkills,
          ...(input.profilePhoto
            ? { profilePhoto: URL.createObjectURL(input.profilePhoto) }
            : {}),
          ...(input.resume
            ? {
                resume: URL.createObjectURL(input.resume),
                resumeOriginalName: input.resume.name,
              }
            : {}),
        },
      };

      // Try Backend API if available
      try {
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        if (input.resume) formData.append("resume", input.resume);
        if (input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);

        const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (res.data.success) {
          updatedUser = res.data.user;
        }
      } catch (err) {
        console.log("Backend offline, updating profile in local demo store");
      }

      dispatch(setUser(updatedUser));
      saveRegisteredUser(updatedUser);
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-gray-900">
            Edit Candidate Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-5 mt-2">
          {/* Full Name & Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
              <Input
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="Enter full name"
                className="mt-1.5 h-11 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter email"
                className="mt-1.5 h-11 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="+91 98765 43210"
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>

          {/* Bio */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Professional Bio</Label>
            <textarea
              rows={3}
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Brief summary of your background, experience, and career goals..."
              className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 resize-none font-medium text-gray-800"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Key Skills (Comma separated)</Label>
            <Input
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="e.g. React.js, Next.js, Node.js, TypeScript, Tailwind CSS, Redux"
              className="mt-1.5 h-11 rounded-xl"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Adding accurate skills increases your AI match scores on job postings.
            </p>
          </div>

          {/* Profile Photo */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Profile Photo</Label>
            <div className="mt-1.5 flex items-center gap-3 border rounded-xl p-2.5 bg-white">
              <Upload className="text-violet-600 ml-2" size={18} />
              <Input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={fileChangeHandler}
                className="border-0 shadow-none text-xs cursor-pointer p-0 h-auto"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Upload New Resume (PDF / DOC)</Label>
            <div className="mt-1.5 flex items-center gap-3 border rounded-xl p-2.5 bg-white">
              <FileText className="text-emerald-600 ml-2" size={18} />
              <Input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={fileChangeHandler}
                className="border-0 shadow-none text-xs cursor-pointer p-0 h-auto"
              />
            </div>
            {user?.profile?.resumeOriginalName && (
              <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 size={13} /> Current: {user.profile.resumeOriginalName}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;

import React from "react";
// import Dashboard from './Dashboard'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { VscGoToEditingSession } from "react-icons/vsc";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      {/* Section 1 */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[80px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName[0].toUpperCase() +
                user?.firstName.slice(1) +
                " " +
                (user?.lastName[0].toUpperCase() +
                  user?.lastName.slice(1))}{" "}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onclick={() => navigate("/dashboard/settings")}
          children={<VscGoToEditingSession size={15} />}
        />
      </div>

      {/* Section 2 */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
            children={<VscGoToEditingSession size={15} />}
          />
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user.additionalDetails.about ?? "Write about yourself"}
        </p>
      </div>

      {/* Section 3 */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
            children={<VscGoToEditingSession size={15} />}
          />
        </div>
        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName ?? "Add your first name"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email ?? "Add your email"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Specify your gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName ?? "Add your last name"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.dateOfBirth ?? "Add date of birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

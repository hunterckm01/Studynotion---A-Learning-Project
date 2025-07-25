import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";

const Navbar = () => {
  
  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state)=>state.profile);
  const {totalItems} = useSelector((state) => state.cart);
  // const location = useLocation()

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false)

  const fetchSubLinks = async () => {
    setLoading(true)
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log("result got after fetching the links are", result);
      setSubLinks(result.data.data);

      console.log("sub links are", subLinks)
      console.log("sublinkes length is", subLinks.length)
    } catch (err) {
      console.log("Could not fetch the category list");
    }
    // console.log("sub links are", subLinks)
    setLoading(false)
  };

  useEffect(()=>{
    fetchSubLinks();
  },[])

  useEffect(()=>{
    console.log("sublinks are", subLinks)
  },[subLinks])

  const location = useLocation();

  function matchRoute(route){
    return matchPath({path: route}, location.pathname);
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between mx-auto h-full">
        {/* Image */}
        <Link to="/"> 
          <img src={logo} height={42} width={160} loading="lazy" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <TiArrowSortedDown />

                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks && subLinks.length ? (
                        <>
                          {subLinks
                            ?.filter((subLink) => subLink?.courses?.length > 0)
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.categoryName
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                key={i}
                              >
                                <p>{subLink.categoryName}</p>
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/Signup/Dashboard */}

        <div className="flex gap-x-4 items-center text-white ">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative flex items-center">
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span >{totalItems}</span>}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button className="border-richblack-700 border-2 bg-richblack-700 px-3 py-2 text-richblack-100 rounded-md hover:bg-richblack-900 hover:transition-all hover:duration-200">
                Log In
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="border-richblack-700 border-2 bg-richblack-700 px-3 py-2 text-richblack-100 rounded-md hover:bg-richblack-900 hover:transition-all hover:duration-200">
                Sign Up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

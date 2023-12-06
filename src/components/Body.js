import RestaurentCard from "./RestaurantCard";
import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
// import useListOfRes from "../utils/useListOfRes";

const Body = () => {
  const [listOfRes, setListOfRes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRes, setFilterRes] = useState([]);
  // const listOfRes = useListOfRes();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.763089020178832&lng=77.26507069360963&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );
    const json = await data.json();
    
    setListOfRes(
      json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setFilterRes(
      json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  const onlineStatus = useOnlineStatus();
  if(onlineStatus===false){
    return <h1>You are offline Check Your Internet Connection...</h1>
  }
  
  if(listOfRes.length===0) return <Shimmer/>;
  return(
    <div className="body">
      <div className=" flex p-4 m-4 items-center justify-center gap-4 text-black font-medium">
        <input
          type="text"
          className="border border-black rounded-md outline-none w-96 h-8 "
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          className=" px-4 py-2 bg-purple-400 rounded-lg   "
          onClick={() => {
            const searchList = listOfRes.filter((res) => 
              res.info.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilterRes(searchList);
          }}
        >
          Search
        </button>
      </div>
      <div className="justify-start mx-4 ">
        <button
          className="px-4 py-2 bg-zinc-800 rounded-lg text-white "
          onClick={() => {
            const filterList = listOfRes.filter(
              (res) => res.info.avgRating > 4
            );
            setFilterRes(filterList);
          }}
        >
          Top Rated Restaurants
        </button>
      </div>
      <div className="flex flex-wrap ">
        {filterRes.map((restaurent) => (
          <Link to={"/restaurant/"+restaurent.info.id} key={restaurent.info.id} ><RestaurentCard resData={restaurent} /></Link>
        ))}
      </div>
    </div>
  );
};

export default Body;

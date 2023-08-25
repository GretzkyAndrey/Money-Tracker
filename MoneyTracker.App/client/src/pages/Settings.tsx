import { Link } from "react-router-dom";
import SettingsItem from "../elements/SettingsItem";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useNavigate } from "react-router";
import { SIGN_OUT } from "../store/Auth/Auth.slice";
import { SHOW_TIME_TRAVEL_POPUP } from "../store/TimeTravel/TimeTravel.slice";

const Settings = () => {
  const navigate = useNavigate();


  const dispatch = useAppDispatch();
  const items = [
    {
      title: "Categories",
      description: "You can create, edit, delete your categories",
      iconUrl: "https://picsum.photos/51",
      pageUrl: "/CategoryList",
    },
    {
      title: "Accounts",
      description: "You can create, edit, delete your accounts",
      iconUrl: "https://picsum.photos/51",
      pageUrl: "/AccountsList",
    },
  ];

  return (
    <main>
      {items.map((item, index) => (
        <Link key={index} to={item.pageUrl}>
          <SettingsItem item={item} />
        </Link>
      ))}
      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button
          className="button"
          onClick={() => {
            dispatch(SHOW_TIME_TRAVEL_POPUP(true));
          }}
        >
          Time Travel
        </button>
        <button
          className="button"
          onClick={() => {
            dispatch(SIGN_OUT());
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
};

export default Settings;

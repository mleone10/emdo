import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faTasks,
  faClipboardList,
  faProjectDiagram,
} from "@fortawesome/free-solid-svg-icons";

import "./NavDrawer.css";

function NavDrawer(props) {
  return (
    <div className="navDrawer">
      <NavLink icon={faHome} path="/" />
      <NavProfile auth={props.auth} />
      <NavDivider />
      <NavLink icon={faTasks} path="/" />
      <NavLink icon={faClipboardList} path="/projects" />
      <NavLink icon={faProjectDiagram} path="/contexts" />
    </div>
  );
}

function NavProfile(props) {
  return (
    (props.auth.currentUser && (
      <Link to="/profile" className="navLastElement navItem">
        <img
          src={props.auth.currentUser.photoURL}
          alt={props.auth.currentUser.displayName}
          className="navProfile"
        />
      </Link>
    )) || <FontAwesomeIcon icon={faUsers} className="navLastElement navItem" />
  );
}

function NavDivider() {
  return <hr className="navDivider" />;
}

function NavLink(props) {
  return (
    <Link to={props.path} className="navItem">
      <FontAwesomeIcon icon={props.icon} />
    </Link>
  );
}

export default NavDrawer;

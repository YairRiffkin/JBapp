import { ActiveHeader, BlankHeader, BlankHomepage, HomeBodyDisplay, HomeDisplay, PendingHeader } from "../components/pages/HomePageDisplayElements";
import { User } from "../models/usertypes";
import '../components/static/pagestyle.css'


export function HomePage({ userDetails }: { userDetails: User | null }) {
  const status = userDetails?.user_level
                  ? userDetails?.user_level === "pending"
                      ? "pending"
                      : "active"
                  : "blank";
return  <div className="form-box">
          {status === "pending" && <PendingHeader />}
          {status === "active" && <ActiveHeader />}
          {status === "blank" && <BlankHeader />}
          <HomeBodyDisplay userDetails={userDetails} />
        </div>        
}

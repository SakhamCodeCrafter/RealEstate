import { useState } from "react";
import { FaShare } from "react-icons/fa";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
} from "react-share";

const ShareButtons = () => {
  const [showShareButtons, setShowShareButtons] = useState(false);
  const shareUrl = window.location.href;
  const title = document.title;

  return (
    <div className="fixed  top-[18%] text-right right-[3%] z-10 rounded-2xl">
      <div className="relative">
        {/* <FaShare
          className="text-slate-500 cursor-pointer"
          onClick={() => setShowShareButtons(!showShareButtons)}
        /> */}
        <button onClick={() => setShowShareButtons(!showShareButtons)} className='bg-slate-100 px-3 py-3 text-2xl font-bold text-white rounded-2xl'>
                   
        <FaShare
          className="text-slate-500 cursor-pointer"
          onClick={() => setShowShareButtons(!showShareButtons)}
        />
                </button>
        {showShareButtons && (
          <div>
            <div className="flex p-3 gap-4 rounded-xl  bg-slate-300 mt-2 right-0 ">
              <FacebookShareButton url={shareUrl} quote={title}>
                <img
                  alt=""
                  src="https://cdn-icons-png.flaticon.com/256/124/124010.png"
                  width={30}
                ></img>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <img
                  alt=""
                  src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705104000&semt=ais"
                  width={30}
                ></img>
              </TwitterShareButton>

              <EmailShareButton url={shareUrl} subject={title}>
                <img
                  alt=""
                  src="https://ongpng.com/wp-content/uploads/2023/09/gmail-logo-2.png"
                  width={30}
                ></img>
              </EmailShareButton>
              <WhatsappShareButton url={shareUrl} title={title}>
                <img
                  alt=""
                  src="https://static.vecteezy.com/system/resources/previews/019/490/741/non_2x/whatsapp-logo-whatsapp-icon-logo-free-free-vector.jpg"
                  width={30}
                ></img>
              </WhatsappShareButton>
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;

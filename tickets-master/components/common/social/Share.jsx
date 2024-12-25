'use client'

import Image from "next/image"
import React, { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'next-share'

const Share = ({ type = 'normal', shareType = 'all', url, title, media = null }) => {

  const { domain } = useContext(AppContext)
  
  const shareUrl = `https://${domain}${url}`
  const shareMedia = media ? `https://${domain}${media}` : null

  function isShowed(name) {
    if (shareType == 'all' || (shareType == 'messengers' && (name == 'FacebookMessenger' || name == 'Whatsapp' || name == 'Telegram' || name == 'Telegram'))) {
      return true
    }
    return false
  }

  return (
    <>
      {type == 'mini' ? (
        <>
          {isShowed('Twitter') && (
            <div
              className="flex-center size-40 rounded-full"
            >
              <TwitterShareButton
                url={shareUrl}
                title={title}
              >
                <i className={`icon-x`} />
              </TwitterShareButton>
            </div>
          )}

          {isShowed('Facebook') && (
            <div
              className="flex-center size-40 rounded-full"
            >
              <FacebookShareButton
                url={shareUrl}
                quote={title}
              >
                <i className={`icon-facebook`} />
              </FacebookShareButton>
            </div>
          )}

          {isShowed('Linkedin') && (
            <div
              className="flex-center size-40 rounded-full"
            >
              <LinkedinShareButton
                url={shareUrl}
              >
                <i className={`icon-linkedin`} />
              </LinkedinShareButton>
            </div>
          )}

          {isShowed('Pinterest') && (
            <>
            {shareMedia && (
              <div
              className="flex-center size-40 rounded-full"
              >
                <PinterestShareButton
                  url={shareUrl}
                  media={shareMedia}
                  description={title}
                >
                  <i className={`icon-pinterest`} />
                </PinterestShareButton>
              </div>
            )}
            </>
          )}
        </>
      ) : (
        <div className="row m-0">
          {isShowed('Twitter') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <TwitterShareButton
                url={shareUrl}
                title={title}
              >
                <TwitterIcon size={26} borderRadius={0} />
              </TwitterShareButton>
            </div>
          )}

          {isShowed('Facebook') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <FacebookShareButton
                url={shareUrl}
                quote={title}
              >
                <FacebookIcon size={26} borderRadius={0} />
              </FacebookShareButton>
            </div>
          )}

          {isShowed('FacebookMessenger') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <FacebookMessengerShareButton
                url={shareUrl}
                quote={title}
              >
                <FacebookMessengerIcon size={26} borderRadius={0} />
              </FacebookMessengerShareButton>
            </div>
          )}

          {isShowed('Whatsapp') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <WhatsappShareButton
                url={shareUrl}
                title={title}
              >
                <WhatsappIcon size={26} borderRadius={0} />
              </WhatsappShareButton>
            </div>
          )}

          {isShowed('Telegram') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <TelegramShareButton
                url={shareUrl}
                title={title}
              >
                <TelegramIcon size={26} borderRadius={0} />
              </TelegramShareButton>
            </div>
          )}

          {isShowed('Linkedin') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <LinkedinShareButton
                url={shareUrl}
              >
                <LinkedinIcon size={26} borderRadius={0} />
              </LinkedinShareButton>
            </div>
          )}

          {isShowed('Reddit') && (
            <div
              className="col-auto p-0 mb-5 mr-5"
            >
              <RedditShareButton
                url={shareUrl}
                title={title}
              >
                <RedditIcon size={26} borderRadius={0} />
              </RedditShareButton>
            </div>
          )}

          {isShowed('Pinterest') && (
            <>
            {shareMedia && (
              <div
                className="col-auto p-0 mb-5 mr-5"
              >
                <PinterestShareButton
                  url={shareUrl}
                  media={shareMedia}
                  description={title}
                >
                  <PinterestIcon size={26} borderRadius={0} />
                </PinterestShareButton>
              </div>
            )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Share;

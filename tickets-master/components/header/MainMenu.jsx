import { Link } from "@/navigation"
import { usePathname } from "@/navigation"
import useMenu from "@/hooks/useMenu"
import { mainMenu as mainMenuData } from "@/data/menu"

const MainMenu = ({ t, style = "" }) => {
  const pathname = usePathname()
  const mainMenu = useMenu({ menu: mainMenuData })

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>

        {mainMenu.map((item, index) => {
          return (
            <li className={pathname === item.link ? "current" : ""} key={index}>
              <div className="d-flex align-items-center">
                {pathname === item.link ? (
                  <div className="link">
                    {t(`header.${item.title}`)}
                  </div>
                ) : (
                  <Link
                    className="link"
                    title={t(`header.${item.title}`)}
                    href={item.link}
                    target={item.openInNewTab ? '_blank' : '_self'}
                    rel={item.rel ? Object.keys(item.rel).filter(key => item.rel[key]).join(' ') : ''}
                  >
                    {t(`header.${item.title}`)}
                  </Link>
                )}
                {item.badge && (
                  <div
                    className="pl-5 position-absolute"
                    style={{right: '0', top: '15px' }}
                  >
                    <div
                      className={`text-11 lh-15 flex-center text-center ${item.badgeClassName}`}
                      style={{ padding: '1px 5px', minWidth: '22px' }}
                    >
                      <span>{t(`badges.${item.badge}`)}</span>
                    </div>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  );
};

export default MainMenu;

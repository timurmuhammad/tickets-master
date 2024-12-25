import TopBreadcrumbs from "@/components/common/breadcrumbs/TopBreadcrumbs"

const Breadcrumbs = ({ link = null, dataArrays = [], activeBreadcrumb }) => {
    return (
        <TopBreadcrumbs
            activeBreadcrumb={activeBreadcrumb}
            dataArrays={dataArrays}
            link={link}
        />
    )
}

export default Breadcrumbs
import MenuTopo from "@/components/elementosPrincipais/menus/topo/menuTopo";
import Rodape from "@/components/elementosPrincipais/rodape";

export default async function LayoutMenuTopo(props){
    return(
        <body className="overflow-x-hidden">
            <MenuTopo/>
            {props.modal}
            {props.children}
            <Rodape/>
        </body>
        
    )
}
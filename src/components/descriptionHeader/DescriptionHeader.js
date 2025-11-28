import './DescriptionHeader.scss';

const DescriptionHeader = ({ descricao, icone }) => {
    return (
        <div className="description-header">
            <span>{descricao}</span>
            {icone ? icone : null}
        </div>
    )
}
export default DescriptionHeader;
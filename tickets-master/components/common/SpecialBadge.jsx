
const SpecialBadge = ({ upTitle = "Special offers", Title = "Black Friday", downTitle = "only today" }) => {
	return (
		<a href="#" className="special-badge">
		  <svg viewBox="0 0 210 210">
		    <g stroke="none" fill="none">
		      <path d="M22,104.5 C22,58.9365081 58.9365081,22 104.5,22 C150.063492,22 187,58.9365081 187,104.5" id="top" />
		      <path d="M22,104.5 C22,150.063492 58.9365081,187 104.5,187 C150.063492,187 187,150.063492 187,104.5" id="bottom" />
		    </g>
		    <circle cx="105" cy="105" r="62" stroke="currentColor" strokeWidth="1" fill="none" />
		    <text width="200" fontSize="20" fill="currentColor">
		      <textPath startOffset="50%" textAnchor="middle" alignmentBaseline="middle" xlinkHref="#top">
		        {upTitle}
		      </textPath>
		    </text>
		    <text width="200" fontSize="20" fill="currentColor">
		      <textPath startOffset="50%" textAnchor="middle" alignmentBaseline="middle" xlinkHref="#bottom">
		        {downTitle}
		      </textPath>
		    </text>
		  </svg>
		  <span>{Title}</span>
		</a>
  	);
};

export default SpecialBadge;

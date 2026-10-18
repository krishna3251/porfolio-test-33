export default function SquigglyText({children,className="",style,as="span"}) {
  const Wrapper=as==="div"?"div":"span";
  return <Wrapper className={`inline-block squiggly-text ${className}`} style={style}>{children}</Wrapper>;
}

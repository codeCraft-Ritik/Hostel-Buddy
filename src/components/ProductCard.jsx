import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { MdHome, MdSchool, MdMeetingRoom } from 'react-icons/md';

const ProductCard = ({ product }) => {
	const navigate = useNavigate();
	const handleExplore = () => {
		navigate(`/product/${product._id}`)
	}

	return (
        <Card 
            className="bg-card border border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20 flex flex-col cursor-pointer"
            onClick={handleExplore}
        >
			<CardHeader shadow={false} floated={false} className="relative h-48 flex-shrink-0">
				<img
					src={product?.images}
					alt={product?.title}
					className="h-full w-full object-cover"
				/>
			</CardHeader>
			<CardBody className="flex-grow flex flex-col p-4">
				<div className="mb-2">
					<Typography variant="h5" color="white" className="font-bold text-card-foreground">
						{product.title}
					</Typography>
					<Typography className="font-normal text-sm text-slate-400 mt-1">
						{product?.description?.substring(0, 40).concat("...")}
					</Typography>
				</div>

				<div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={product?.owner?.profileImage} alt="owner" className="rounded-full h-10 w-10 object-cover" />
                        <div>
                            <Typography color="white" className="font-semibold text-card-foreground">
                                {product?.owner?.name}
                            </Typography>
                             <Typography className="text-xs text-slate-400">
                                Batch of {product?.owner?.batchYear}
                            </Typography>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex items-center gap-2">
                            <MdHome size={14}/>
                            <span>{product?.owner?.hostel?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdMeetingRoom size={14}/>
                            <span>Room No. {product?.owner?.room}</span>
                        </div>
                    </div>
                </div>
			</CardBody>
		</Card>
	)
}

export default ProductCard;
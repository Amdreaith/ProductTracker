
-- Function to get product sales by quantity
CREATE OR REPLACE FUNCTION public.get_product_sales_by_quantity()
RETURNS TABLE(
    prodcode character varying,
    description character varying,
    total_quantity numeric
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.prodcode,
        p.description,
        SUM(sd.quantity) as total_quantity
    FROM 
        product p
    JOIN 
        salesdetail sd ON p.prodcode = sd.prodcode
    GROUP BY 
        p.prodcode, p.description
    ORDER BY 
        total_quantity DESC;
END;
$$;

-- Function to get top customers by sales value
CREATE OR REPLACE FUNCTION public.get_top_customers_by_sales()
RETURNS TABLE(
    custno character varying,
    custname character varying,
    total_sales numeric
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.custno,
        c.custname,
        SUM(sd.quantity * ph.unitprice) as total_sales
    FROM 
        customer c
    JOIN 
        sales s ON c.custno = s.custno
    JOIN 
        salesdetail sd ON s.transno = sd.transno
    JOIN 
        pricehist ph ON sd.prodcode = ph.prodcode
    GROUP BY 
        c.custno, c.custname
    ORDER BY 
        total_sales DESC;
END;
$$;

-- Function to get monthly sales data
CREATE OR REPLACE FUNCTION public.get_monthly_sales_data()
RETURNS TABLE(
    month text,
    sales numeric
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(s.salesdate, 'Mon YYYY') as month,
        SUM(sd.quantity * ph.unitprice) as sales
    FROM 
        sales s
    JOIN 
        salesdetail sd ON s.transno = sd.transno
    JOIN 
        pricehist ph ON sd.prodcode = ph.prodcode
    GROUP BY 
        TO_CHAR(s.salesdate, 'Mon YYYY'), 
        EXTRACT(YEAR FROM s.salesdate), 
        EXTRACT(MONTH FROM s.salesdate)
    ORDER BY 
        MIN(s.salesdate);
END;
$$;

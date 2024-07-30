<script setup>

</script>

<template >
<div class="form_container">
    <form class="form" method="post">
        <slot>

        </slot>
    </form>
</div>

</template>


<style lang="scss">
@import "@/assets/scss/mixins";
.form_container{
        width:80%;
        padding:20px 0px;
        @include horizon-center;

    form{
        @include horizon-center;
        @include perfect-center;
        flex-direction:column;
        gap:0.3em;
        padding:2em;
        background:var(--secondary-background);
        border-radius:7px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        width:50%;
        .field-wrapper{
            width:90%;
            margin-bottom:10px;
            .avatar-wrapper{
                @include perfect-center;

                label{
                    position:relative;
                    top:0px;
                    width:9rem;
                    height:9rem;;
                    border-radius:50%;
                    cursor:pointer; 
                    img{
                        position:absolute;
                        top:0px;
                        width:100%;
                        height:100%;
                        border-radius:50%;
                    }

                    .action-wrapper{
                        position:absolute;
                        top:0px;
                        border-radius:50%;
                        @include perfect-center;
                        width:9rem;
                        height:9rem;
                        background:transparent;
                        transition:0.3s ease-in;
                        color:var(--secondary-background);
                        i{opacity:0}
                    }

                    .action-wrapper:hover {
                        background:#18181880;
                    }

                    .action-wrapper:hover i {
                        opacity:1;
                    }

                
                }
            }
            .input-wrapper{
                position:relative;
                i{
                    @include perfect-center;
                    opacity:0.7;
                    position:absolute;
                    width:10%;
                    height:100%;
                    top:0px;
                    left:0px;
                    text-align:center;
                    background:var(--primary-background);
                }  
            }

            label{text-align:left; opacity:0.75;}

            input{
                border:0.08px solid  #7a7f9a45;
                border-radius:3px;
                background:#fff;
                padding:15px;
                width:100%; 
                height:100%;
                padding-left:11%;
                margin-top:5px;
            }
        }
        .check{
            display:flex;
            align-items:center;
            gap:0em;
            input{ margin-right:10px;}
            label{font-size:16px !important;}
        }
        input[type="submit"]{
            background:var(--color-primary);
            color:var(--secondary-background);
            border:0px;
            padding:12px 12px;
            text-align:center;
            cursor:pointer;
        }
    }

    p{
        text-align:center;
        margin-top:20px;
        color:var(--color-text-secondary)
    }
}




@media(max-width:1400px){
  form{
    width:90% !important;
   
  }
}
</style>